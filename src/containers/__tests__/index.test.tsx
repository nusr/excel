import { render, screen, act, waitFor } from '@testing-library/react';
import { Excel } from '../index';
import { StateContext } from '../store';
import { initController } from '../../controller';
import '@testing-library/jest-dom';

describe('Excel Component', () => {
  it('should render component when isLoading is false', async () => {
    act(() => {
      render(
        <StateContext value={{ controller: initController() }}>
          <Excel />
        </StateContext>,
      );
    });

    expect(screen.queryByText('default name')).toBeInTheDocument();
    expect(screen.queryByTestId('loading')).toBeNull();
  });

  it('should render component', async () => {
    const mockGetDocument = jest.fn();

    const mockProvider = {
      getDocument: mockGetDocument,
    };

    act(() => {
      mockGetDocument.mockResolvedValue({ name: 'test-name11', content: '' });
      render(
        <StateContext
          value={{ controller: initController(), provider: mockProvider }}
        >
          <Excel />
        </StateContext>,
      );
    });
    expect(screen.queryByTestId('loading')).toBeNull();

    await waitFor(() => {
      expect(screen.queryByText('test-name11')).toBeInTheDocument();
    });
  });
});
