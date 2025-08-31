import { Textarea as HeadlessTextarea } from '@headlessui/react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { clsx } from 'clsx';
import type { DetailedHTMLProps, ForwardedRef, MouseEvent, ReactNode, TextareaHTMLAttributes } from 'react';
import { useId, forwardRef } from 'react';
import Button from '@/components/common/Button';
import type { FieldProps } from '@/components/common/Field';
import Field from '@/components/common/Field';
import InputGroup from '@/components/common/Input/InputGroup';

export type TextareaProps = DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> &
    Omit<FieldProps, 'id' | 'children'> & {
        inputState?: 'valid' | 'invalid' | 'normal';
        prefixElement?: ReactNode;
        suffixElement?: ReactNode;
        onSuffixClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    };

const TextareaWithRef = (
    {
        id,
        label,
        labelExtra,
        className,
        helpElement,
        inputState = 'normal',
        errorElement,
        prefixElement,
        suffixElement: suffixElementFromProps,
        onSuffixClick,
        ...props
    }: TextareaProps,
    ref: ForwardedRef<HTMLTextAreaElement>
) => {
    const elementId = useId();
    const computedId = id || elementId;

    let suffixElement = suffixElementFromProps;

    if (inputState === 'invalid') {
        suffixElement = <ExclamationCircleIcon aria-hidden="true" className="size-5 text-red-500" />;
    } else if (inputState === 'valid') {
        suffixElement = <CheckCircleIcon aria-hidden="true" className="size-5 text-green-500" />;
    }

    const input = (
        <InputGroup disabled={props.disabled} inputState={inputState}>
            {prefixElement && (
                <div className="shrink-0 text-base text-gray-400 select-none sm:text-sm/6">{prefixElement}</div>
            )}
            <HeadlessTextarea
                ref={ref}
                data-with-prefix={!!prefixElement || undefined}
                data-with-suffix={!!suffixElement || undefined}
                className={clsx(
                    // base
                    'w-full grow resize-none border-0 px-0 py-1.5 shadow-none placeholder:text-gray-400 sm:text-sm sm:leading-6',
                    // focus
                    'focus:ring-0',
                    // margins for prefix and suffix
                    'data-with-prefix:pl-1 data-with-suffix:pr-1',
                    // disable state
                    'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500'
                )}
                rows={2}
                id={computedId}
                {...props}
            />
            {suffixElement &&
                (onSuffixClick ? (
                    <Button
                        type="button"
                        className="inset-y-0 flex shrink-0 cursor-pointer items-center px-0 text-gray-400 shadow-inherit hover:text-gray-500"
                        onClick={onSuffixClick}
                    >
                        {suffixElement}
                    </Button>
                ) : (
                    <div className="shrink-0 text-base text-gray-400 select-none sm:text-sm/6">{suffixElement}</div>
                ))}
        </InputGroup>
    );

    return (
        <Field
            name={props.name}
            id={computedId}
            label={label}
            errorElement={errorElement}
            helpElement={helpElement}
            labelExtra={labelExtra}
        >
            {input}
        </Field>
    );
};

const Textarea = forwardRef(TextareaWithRef);

export default Textarea;
