import { Row, Column, Section } from '@react-email/components';

interface EDMDescriptionsProps {
    descriptions: { value: string; label: string }[];
}

const EDMDescriptions = ({ descriptions }: EDMDescriptionsProps) => (
    <Section className="my-5">
        {descriptions.map(i => (
            <Row key={i.label} className=" py-2 border-b-2 border-solid border-b-gray-300">
                <Column className="text-gray-500 text-sm w-1/2">{i.label}</Column>
                <Column className="text-gray-900 font-semibold text-lg w-1/2">{i.value}</Column>
            </Row>
        ))}
    </Section>
);

export default EDMDescriptions;
