import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';

export enum TocNodeStatus {
  COMPRESS,
  EXPANDED,
}

export enum TocNodeStatusOperator {
  SCROLL,
  MANUAL,
}

export type HeaderStatusType = {[key: string]: {status: TocNodeStatus, operator: TocNodeStatusOperator, isMain: boolean}}

const HeaderContext = createContext<[HeaderStatusType, Dispatch<SetStateAction<HeaderStatusType>>]>(null as any);

export function HeaderExpandedProvider({children}: {children: any}) {
  const [expanded, setExpanded] = useState<HeaderStatusType>({});
  return <HeaderContext.Provider value={[expanded,setExpanded ]}>
    {children}
  </HeaderContext.Provider>;
}

export function CustomHeaderExpandedProvider({children, expanded, setExpanded }: {children: any, expanded:HeaderStatusType, setExpanded:  Dispatch<SetStateAction<HeaderStatusType>>}) {
  return <HeaderContext.Provider value={[expanded,setExpanded ]}>
    {children}
  </HeaderContext.Provider>;
}

export function useHeaderExpanded(){
  return useContext(HeaderContext);
}