import React from 'react';
import renderer from 'react-test-renderer';
import { MockTheme } from '@tests/utils';
import { MsgStoreRawDataRequest } from '@models';
import StoreRawDataRequest from '.';

// ==================================
// mocks
// ==================================

jest.mock('@components/name', () => (props: JSX.IntrinsicElements['div']) => (
  <div id="Name" {...props} />
));

jest.mock('next-translate/Trans', () => (props) => <div id="Trans" {...props} />);

// ==================================
// unit tests
// ==================================
describe('screen: TransactionDetails/StoreRawDataRequest', () => {
  it('matches snapshot', () => {
    const message = new MsgStoreRawDataRequest({
      category: 'data',
      type: 'MsgStoreRawDataRequest',
      sender: 'sender',
    });

    const component = renderer.create(
      <MockTheme>
        <StoreRawDataRequest message={message} />
      </MockTheme>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    expect(component.root.findByProps({ id: 'Trans' }).props.i18nKey).toEqual(
      'message_contents:MsgStoreRawDataRequest'
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
