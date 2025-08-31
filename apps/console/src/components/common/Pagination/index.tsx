import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';
import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type PageBlockProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    current: boolean;
};

const PageBlock = ({ current, ...props }: PageBlockProps) => (
    <button
        data-current={current || undefined}
        className={clsx(
            'inline-flex cursor-pointer items-center border-t-2 px-4 pt-4 text-sm font-medium',
            'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            'data-current:border-pink-500 data-current:text-pink-500 hover:data-current:text-pink-400'
        )}
        type="button"
        {...props}
    />
);

const Ellipses = () => (
    <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
        ...
    </span>
);

type PageButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    design: 'previous' | 'next';
};

const PageButton = ({ design, ...props }: PageButtonProps) => {
    const { t } = useTranslation('common');

    return (
        <button
            className={clsx(
                'inline-flex items-center border-t-2 border-transparent pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700',
                design === 'previous' && 'pr-1',
                design === 'next' && 'pl-1'
            )}
            type="button"
            {...props}
        >
            {design === 'previous' && (
                <>
                    <ArrowLongLeftIcon aria-hidden="true" className="mr-3 size-5 text-gray-400" />
                    {t('common:pagination.previous')}
                </>
            )}
            {design === 'next' && (
                <>
                    {t('common:pagination.next')}
                    <ArrowLongRightIcon aria-hidden="true" className="ml-3 size-5 text-gray-400" />
                </>
            )}
        </button>
    );
};

interface PaginationProps {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number, pageSize: number) => void;
    className?: string;
    /**
     * before break page will display all page block
     * after break page will display ellipses
     */
    breakPage?: number;
    /*
     * visible page blocks when total pages are more than break page
     */
    visiblePages?: number;
}

const Pagination = ({
    current,
    total,
    pageSize,
    onChange,
    className,
    breakPage = 6,
    visiblePages = 5,
}: PaginationProps) => {
    const totalPages = Math.ceil(total / pageSize);

    const onPrevious = useCallback(() => {
        onChange(Math.max(current - 1, 1), pageSize);
    }, [current, onChange, pageSize]);

    const onNext = useCallback(() => {
        onChange(Math.min(current + 1, totalPages), pageSize);
    }, [current, onChange, pageSize, totalPages]);

    const renderPage = useMemo(() => {
        const showPages = Math.max(visiblePages, 3);
        const pages = [];

        // if total pages less then breakPage, then show all page block
        if (totalPages <= breakPage) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(
                    <PageBlock key={`page-${i}`} current={current === i} onClick={() => onChange(i, pageSize)}>
                        {i}
                    </PageBlock>
                );
            }

            return pages;
        }

        // add first page
        pages.push(
            <PageBlock key="first-page" current={current === 1} onClick={() => onChange(1, pageSize)}>
                1
            </PageBlock>
        );

        // add page
        if (current < showPages - 1) {
            for (let i = 2; i <= showPages - 1; i++) {
                pages.push(
                    <PageBlock key={`page-${i}`} current={current === i} onClick={() => onChange(i, pageSize)}>
                        {i}
                    </PageBlock>
                );
            }
            pages.push(<Ellipses key="ellipses" />);
        } else if (current > totalPages - (showPages - 1)) {
            pages.push(<Ellipses key="ellipses" />);
            for (let i = totalPages - (showPages - 1) + 1; i <= totalPages - 1; i++) {
                pages.push(
                    <PageBlock key={`page-${i}`} current={current === i} onClick={() => onChange(i, pageSize)}>
                        {i}
                    </PageBlock>
                );
            }
        } else {
            pages.push(<Ellipses key="ellipses-a" />);
            const start = current - Math.floor((showPages - 2) / 2);
            const end = start + showPages - 2;
            for (let i = start; i < end; i++) {
                pages.push(
                    <PageBlock key={`page-${i}`} current={current === i} onClick={() => onChange(i, pageSize)}>
                        {i}
                    </PageBlock>
                );
            }
            pages.push(<Ellipses key="ellipses-b" />);
        }

        // add last page
        pages.push(
            <PageBlock key="last-page" current={current === totalPages} onClick={() => onChange(totalPages, pageSize)}>
                {totalPages}
            </PageBlock>
        );

        return pages;
    }, [breakPage, current, onChange, pageSize, totalPages, visiblePages]);

    return (
        <nav
            className={`flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 ${className}`}
            data-cy="pagination"
        >
            <div className="-mt-px flex w-0 flex-1">
                <PageButton design="previous" onClick={onPrevious} />
            </div>
            <div className="hidden md:-mt-px md:flex">{renderPage}</div>
            <div className="-mt-px flex w-0 flex-1 justify-end">
                <PageButton design="next" onClick={onNext} />
            </div>
        </nav>
    );
};

export default Pagination;
