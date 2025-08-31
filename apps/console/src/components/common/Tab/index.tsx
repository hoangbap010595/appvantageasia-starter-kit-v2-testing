import { clsx } from 'clsx';
import { useNavigate } from 'react-router';
import type { SelectProps } from '../Select';
import Select from '../Select';
import type { TabItemWithState } from './makeUseTabs';

export interface TabProps {
    tabs: TabItemWithState[];
    onChange?: (key: string) => void;
}

const Tab = ({ tabs, onChange }: TabProps) => {
    const navigate = useNavigate();

    const onSelectChange = (val: SelectProps['value']) => {
        const find = tabs.find(tab => tab.key === val);
        if (find?.href) {
            navigate(find.href);
        } else if (onChange) {
            onChange(val as string);
        }
    };

    return (
        <>
            <div className="sm:hidden">
                <Select
                    name="tab"
                    onChange={onSelectChange}
                    options={tabs?.map(i => ({ value: i.key, label: i.name }))}
                    value={tabs?.find(tab => tab.current)?.key}
                />
            </div>
            <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                    <nav aria-label="Tabs" className="-mb-px flex space-x-8">
                        {tabs?.map(tab =>
                            tab.href ? (
                                <a
                                    key={tab.key}
                                    aria-current={tab.current ? 'page' : undefined}
                                    className={clsx(
                                        tab.current
                                            ? `border-pink-400 text-pink-400`
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                        'border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap'
                                    )}
                                    href={tab.href}
                                >
                                    {tab.name}
                                </a>
                            ) : (
                                <button
                                    key={tab.key}
                                    className={clsx(
                                        tab.current
                                            ? `border-pink-400 text-pink-400`
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                        'border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap'
                                    )}
                                    onClick={() => onChange && onChange(tab.key)}
                                    type="button"
                                >
                                    {tab.name}
                                </button>
                            )
                        )}
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Tab;
