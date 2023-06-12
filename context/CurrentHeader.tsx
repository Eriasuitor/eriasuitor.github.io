import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';

type ValueType = string[]

const HeaderContext = createContext<[ValueType, Dispatch<SetStateAction<ValueType>>]>(null as any);

export function CurrentHeaderProvider({children}: {children: any}) {
  const [currentHeader, setCurrentHeader] = useState<ValueType>([]);
  return <HeaderContext.Provider value={[currentHeader,setCurrentHeader ]}>
    {children}
  </HeaderContext.Provider>;
}

export function useCurrentHeader(){
  return useContext(HeaderContext);
}