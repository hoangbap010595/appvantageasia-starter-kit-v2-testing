import { ComputerDesktopIcon, DevicePhoneMobileIcon, DeviceTabletIcon } from '@heroicons/react/24/outline';
import isEqual from 'lodash/fp/isEqual';
import { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { UAParser } from 'ua-parser-js';
import type { ProfileDataFragment } from '../FetchProfile.api';
import RevokeSession from './RevokeSession';
import { useFetchUserSessionsQuery } from './UserSessions.api';
import useListReducer from './useListReducer';
import Pagination from '@/components/common/Pagination';
import Space from '@/components/common/Space';
import Table from '@/components/common/Table';
import type { TableProps } from '@/components/common/Table/types';
import { useUserSession } from '@/contexts/UserSession';
import getDeviceType, { DeviceType } from '@/utils/getDeviceType';
import useDateFormats from '@/utils/useDateFormats';

export interface UserSessionsProps {
    profile: ProfileDataFragment;
}

const UserSessions = ({ profile }: UserSessionsProps) => {
    const { t } = useTranslation('profile');
    const { sessionId } = useUserSession();

    const [state, dispatch] = useListReducer();
    const { page, pageSize } = state;
    const { data, loading, refetch } = useFetchUserSessionsQuery({
        fetchPolicy: 'cache-and-network',
        variables: { id: profile.id, pagination: { offset: (page - 1) * pageSize, limit: pageSize } },
    });

    const { formatDateTime } = useDateFormats();
    const columns: TableProps['columns'] = useMemo(
        () => [
            {
                title: t('profile:sections.sessions.sessionsTable.headers.device'),
                dataIndex: 'device',
                key: 'device',
                render: (_, session) => {
                    const { browser, device } = UAParser(session.userAgent || '');

                    const icon = (() => {
                        const type = getDeviceType(session.userAgent || '');
                        switch (type) {
                            case DeviceType.Tablet:
                                return <DeviceTabletIcon className="h-5 w-5" />;

                            case DeviceType.Mobile:
                                return <DevicePhoneMobileIcon className="h-5 w-5" />;

                            default:
                                return <ComputerDesktopIcon className="h-5 w-5" />;
                        }
                    })();

                    return (
                        <div className="flex">
                            {icon}
                            <span className="pl-2">
                                {device.vendor} {device.model} ({browser.name}
                                {session.ip ? ` ${session.ip}` : ''})
                            </span>
                        </div>
                    );
                },
            },
            {
                title: t('profile:sections.sessions.sessionsTable.headers.lastActivity'),
                dataIndex: 'lastActivityAt',
                key: 'lastActivityAt',
                render: (value: any, record) => {
                    const lastActivity = formatDateTime(value);
                    if (record.isValid) {
                        if (sessionId === record.id) {
                            return t('profile:sections.sessions.sessionsTable.current', { at: lastActivity });
                        }

                        return lastActivity;
                    }

                    return t('profile:sections.sessions.sessionsTable.signedOut', { at: lastActivity });
                },
            },
            {
                title: t('profile:sections.sessions.sessionsTable.headers.actions'),
                dataIndex: 'actions',
                key: 'actions',
                render: (_, record) => (record.isValid ? <RevokeSession record={record} refetch={refetch} /> : null),
            },
        ],
        [formatDateTime, refetch, sessionId, t]
    );

    const total = data?.lists?.count || 0;
    const onPageChange = useCallback(
        (current: number) => {
            dispatch({ type: 'setPage', page: current });
        },
        [dispatch]
    );

    const currentItems = useRef(data?.lists.items);
    const currentTotal = useRef(total);

    if (!loading && (!isEqual(currentItems.current, data?.lists.items) || !isEqual(currentTotal.current, total))) {
        currentItems.current = data?.lists.items;
        currentTotal.current = total;
    }

    // if we have previous item we do not use the loading state
    // by doing so we avoid blinking
    const isLoading = loading && !currentItems.current;

    return (
        <Space direction="vertical">
            <Table
                columns={columns}
                dataSource={currentItems.current as TableProps['dataSource']}
                loading={isLoading}
            />
            {currentTotal.current > pageSize && (
                <Pagination current={page} onChange={onPageChange} pageSize={pageSize} total={currentTotal.current} />
            )}
        </Space>
    );
};

export default UserSessions;
