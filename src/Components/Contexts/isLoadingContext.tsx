import React from 'react';

const IsLoadingContext = React.createContext({
  isLoading: true,
  setIsLoading: () => {},
});

export default IsLoadingContext;