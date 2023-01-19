import { InfiniteQuery } from '@/hooks/useInfiniteQuery/types';
import { TableFooterProps } from '@mui/material/TableFooter';
import { ComponentType } from 'react';

export const UNKNOWN_ITEM_COUNT = Number.MAX_SAFE_INTEGER;

export type HeaderProps<TVariables> = {
  variables: TVariables;
  width: number;
  height: number;
};

export type RowProps<TData, TVariables, TItem> = Pick<JSX.IntrinsicElements['div'], 'style'> &
  Pick<InfiniteQuery<TData, TVariables, TItem>, 'items' | 'itemsPerPage'> & {
    variables: TVariables;
    index: number;
    rowHeight: (index: number) => number;
    isScrolling: boolean;
    width: number;
    height: number;
  };

export interface ItemData<TData, TVariables, TItem>
  extends Pick<InfiniteQuery<TData, TVariables, TItem>, 'items' | 'itemsPerPage'> {
  variables: TVariables;
  rowHeight: (index: number) => number;
  RowComponent: ComponentType<RowProps<TData, TVariables, TItem>>;
}

export interface InfiniteListProps<TData, TVariables, TItem>
  extends Pick<
    InfiniteQuery<TData, TVariables, TItem>,
    'items' | 'itemsPerPage' | 'itemCount' | 'refetch'
  > {
  variables: TVariables;
  className?: string;
  rowHeight: (index: number) => number;
  reloadOnScollTop?: boolean;
  disablePagination?: boolean;
  HeaderComponent?: ComponentType<HeaderProps<TVariables>>;
  RowComponent: ComponentType<RowProps<TData, TVariables, TItem>>;
}

export interface PaginationProps extends TableFooterProps {
  itemsPerPage: number;
  itemCount: number;
  page: number;
  onPageChange: (newPage: number) => void;
}