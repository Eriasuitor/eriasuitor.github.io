'use client';
import {
  CustomHeaderExpandedProvider,
  HeaderStatusType,
  TocNodeStatus,
  TocNodeStatusOperator,
  useHeaderExpanded
} from '@/context/HeaderExpandedContext';
import classNames from 'classnames';
import _ from 'lodash';
import {
  Dispatch,
  HTMLAttributes,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './toc.module.css';

export function Toc({
  postContentKey,
  ...args
}: {
  postContentKey: string;
} & HTMLAttributes<HTMLDivElement>) {
  const [headers] = useToc(postContentKey);
  const flatHeaders = useMemo(() => {
    function getHeaders(headers: HeaderNode[]): HeaderNode[] {
      return headers
        .map((header) => [header, getHeaders(header.children)].flat())
        .flat();
    }
    return getHeaders(headers);
  }, [headers]);
  const handleRef = useRef<HeaderStatusType>({});
  const [expanded, setExpanded] = useState<HeaderStatusType>({});

  const expand = useCallback(
    _.debounce(
      (key: string, operator: TocNodeStatusOperator, updateMain: boolean) => {
        const chain = loopFind(headers, key, 0);
        flatHeaders.forEach(({ key }) => {
          if (updateMain && handleRef.current[key]) handleRef.current[key].isMain = false;
          if ([handleRef.current[key]?.operator, operator].includes(TocNodeStatusOperator.MANUAL))
            return;
          handleRef.current[key] = {
            status: TocNodeStatus.COMPRESS,
            operator,
            isMain: false,
          };
        });
        chain?.forEach(
          (c) =>
            (handleRef.current[c.key] = {
              status: TocNodeStatus.EXPANDED,
              operator,
              isMain: false,
            })
        );
        if (updateMain && handleRef.current[key]) handleRef.current[key].isMain = true;
        setExpanded({ ...handleRef.current });
      },
      100,
      { leading: true }
    ),
    [headers, flatHeaders, handleRef]
  );

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver((entries) => {
      if (Date.now() < ignoreUntil) return;
      const entry = entries.find((e) => e.isIntersecting);
      if (!entry) return;
      const header = flatHeaders.find(
        (header) => header.element === entry?.target
      );
      if (!header) return;
      expand(header.key, TocNodeStatusOperator.SCROLL, true);
    }, {});
    flatHeaders.forEach((header) =>
      intersectionObserver.observe(header.element)
    );
    return () =>
      flatHeaders.forEach((header) =>
        intersectionObserver.unobserve(header.element)
      );
  }, [headers, flatHeaders, expand]);
  handleRef.current = expanded;

  return (
    <CustomHeaderExpandedProvider expanded={expanded} setExpanded={setExpanded}>
      <div {...args}>
        {headers.map((node) => (
          <TocNode
            key={node.key}
            tocNode={node}
            onExpanded={(header, withScroll) => {
              ignoreUntil = Date.now() + 500;
              if (withScroll) {
                expand(header.key, TocNodeStatusOperator.MANUAL, true);
                header.element?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                });
              } else {
                if (expanded[header.key]?.status === TocNodeStatus.EXPANDED) {
                  expanded[header.key].status = TocNodeStatus.COMPRESS;
                  setExpanded({ ...expanded });
                } else {
                  expanded[header.key].status = TocNodeStatus.COMPRESS;
                  setExpanded({ ...expanded });
                  expand(header.key, TocNodeStatusOperator.MANUAL, false);
                }
              }
            }}
          />
        ))}
      </div>
    </CustomHeaderExpandedProvider>
  );
}

let ignoreUntil = Date.now();

interface HeaderNode {
  key: string;
  element: Element;
  title: string;
  children: HeaderNode[];
}

export function combineHeaders(
  elements: NodeListOf<Element>,
  start: number
): { end: number; node: HeaderNode } {
  const currentElement = elements.item(start);
  const result: HeaderNode = {
    key: String(Math.random() * 100000),
    element: currentElement,
    title: currentElement.innerHTML,
    children: [],
  };
  let i = start + 1;
  while (i < elements.length) {
    if (currentElement.nodeName >= elements.item(i).nodeName) break;
    const { end, node } = combineHeaders(elements, i);
    result.children.push(node);
    i = end + 1;
  }
  return { end: i - 1, node: result };
}

export function getToc(postContentKey: string) {
  const postContent = document.getElementById(postContentKey);
  const headerElements = postContent?.querySelectorAll(
    'h1, h2, h3, h4, h5, h6'
  );
  if (!headerElements) return [];
  let current = 0;
  const result = [];
  while (current < headerElements.length) {
    const { end, node } = combineHeaders(headerElements, current);
    result.push(node);
    current = end + 1;
  }
  return result;
}

export function useToc(postContentKey: string) {
  const [headers, setHeaders] = useState<HeaderNode[]>([]);
  useEffect(() => {
    setHeaders(getToc(postContentKey));
  }, [postContentKey]);
  return [headers, setHeaders] as [
    HeaderNode[],
    Dispatch<SetStateAction<HeaderNode[]>>
  ];
}

function loopFind(
  headers: HeaderNode[],
  key: string,
  depth: number
): HeaderNode[] | undefined {
  if (depth > 20) throw new Error('Depths overflow.');
  for (const header of headers) {
    if (header.key === key) return [header];
    const result = loopFind(header.children, key, depth + 1);
    if (result) return [header, ...result];
  }
}

function TocNode({
  tocNode,
  onExpanded,
}: {
  tocNode: HeaderNode;
  onExpanded: (element: HeaderNode, withScroll: boolean) => void;
} & HTMLAttributes<HTMLDivElement>) {
  const [headerExpanded] = useHeaderExpanded();
  return (
    <>
      <div
        style={{
          marginLeft: `${
            tocNode.element?.nodeName?.replace(/[^0-9]/, '') || 0
          }rem`,
        }}
        className={classNames({
          [styles.title]: true,
          [styles.not_leaf]: tocNode.children.length,
          [styles.expanded]: headerExpanded[tocNode.key]?.status === TocNodeStatus.EXPANDED,
        })}
      >
        <span
          className={styles.icon}
          onClick={() => onExpanded(tocNode, false)}
        />
        <span
          className={classNames({
            [styles.scroll_main]: headerExpanded[tocNode.key]?.isMain,
          })}
          onClick={() => onExpanded(tocNode, true)}
        >
          {tocNode.title}
        </span>
      </div>
      {headerExpanded[tocNode.key]?.status === TocNodeStatus.EXPANDED && (
        <div>
          {tocNode.children.map((node) => (
            <TocNode key={node.key} tocNode={node} onExpanded={onExpanded} />
          ))}
        </div>
      )}
    </>
  );
}
