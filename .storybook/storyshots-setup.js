jest.mock('rc-animate');
jest.mock('rc-tabs');
jest.mock('rc-select');
jest.mock('css-animation');
jest.mock('../src/widgets/FollowButton');

jest.mock('react-dom', () => ({
  findDOMNode() {
    return null;
  },
}));
