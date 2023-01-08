import Box from '@mui/material/Box';
import React, { PropsWithChildren } from 'react';
import { RecoilValue, useRecoilValueLoadable } from 'recoil';

const Loading: React.FC = () => (
  <Box
    display={'flex'}
    alignItems={'center'}
    justifyContent={'center'}
    height={'500px'}
  >
    Loading...
  </Box>
);

interface OwnProps {
  selector: RecoilValue<unknown>;
  loader?: JSX.Element;
}

export const Loader: React.FC<PropsWithChildren<OwnProps>> = ({
  children,
  selector,
  loader,
}) => {
  const userNameLoadable = useRecoilValueLoadable(selector);

  switch (userNameLoadable.state) {
    case 'hasValue':
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <>{children}</>;
    case 'loading':
      return loader || <Loading />;
    case 'hasError':
      throw userNameLoadable.contents;
  }
};

export default Loader;
