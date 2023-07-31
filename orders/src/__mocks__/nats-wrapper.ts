/**
 * mocks the nats-wrapper file
 * exposes the fake client and publish methods to publishing test suites
 */
export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};
