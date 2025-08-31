import { MockedProvider } from '@apollo/client/testing';
import type { ReactNode } from 'react';
import { makeDecorator } from 'storybook/preview-api';

const withStorybookApollo = makeDecorator({
    name: 'withStorybookApollo',
    parameterName: 'apollo',
    wrapper: (getStory, context, { parameters }) => (
        <MockedProvider mocks={parameters?.mocks || []}>{getStory(context) as ReactNode}</MockedProvider>
    ),
});

export default withStorybookApollo;
