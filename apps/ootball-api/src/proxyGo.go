package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/url"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

func Handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	headers := map[string]string{"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}

	urlProxy := getURLConfig(request)

	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	svc := dynamodb.New(sess)

	tableName := "my-first-table"
	primaryKey := urlProxy["keyEncoded"].(string)

	result, err := svc.GetItem(&dynamodb.GetItemInput{
		TableName: aws.String(tableName),
		Key: map[string]*dynamodb.AttributeValue{
			"primaryKey": {
				S: aws.String(primaryKey),
			},
		},
	})
	if err != nil {
		b, err := json.Marshal(handleError(err))
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       string(b),
			Headers:    headers,
		}, err
	}

	if result.Item == nil {
		b, err := json.Marshal(handleError(err))
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       string(b),
			Headers:    headers,
		}, err
	}

	var anyJson map[string]interface{}

	err = dynamodbattribute.UnmarshalMap(result.Item, &anyJson)
	if err != nil {
		b, err := json.Marshal(handleError(err))
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       string(b),
			Headers:    headers,
		}, err
	}

	b, err := json.Marshal(anyJson)
	if err != nil {
		b, err := json.Marshal(handleError(err))
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       string(b),
			Headers:    headers,
		}, err
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(b),
		Headers:    headers,
	}, nil
}

func handleError(err error) map[string]interface{} {
	return map[string]interface{}{
		"error": err.Error(),
	}
}

func getURLConfig(event events.APIGatewayProxyRequest) map[string]interface{} {
	urlProxy := fmt.Sprintf("%s?%s", event.Path, encodeParams(event.QueryStringParameters))
	urlProxy = strings.ToLower(strings.TrimSpace(urlProxy))

	baseURL, _ := url.Parse(fmt.Sprintf("https://football-web-pages1.p.rapidapi.com%s", urlProxy))

	keyTidy := fmt.Sprintf("%s?%s", strings.ToLower(baseURL.Path), strings.ToLower(baseURL.RawQuery))
	keyTidy = removeLastQuestionMark(strings.TrimSpace(keyTidy))

	keyEncoded := base64.StdEncoding.EncodeToString([]byte(keyTidy))

	return map[string]interface{}{
		"url":        baseURL.String(),
		"keyTidy":    keyTidy,
		"keyEncoded": keyEncoded,
	}
}

func encodeParams(params map[string]string) string {
	values := url.Values{}
	for key, value := range params {
		values.Add(key, value)
	}
	return values.Encode()
}

func removeLastQuestionMark(input string) string {
	if strings.HasSuffix(input, "?") {
		return input[:len(input)-1]
	}
	return input
}

func main() {
	lambda.Start(Handler)
}
