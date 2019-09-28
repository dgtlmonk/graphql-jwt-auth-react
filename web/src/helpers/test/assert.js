// base of RITE-way TDD
// https://github.com/ericelliott/riteway

// TODO: add these functions
const assertFns = ['toMatch', 'toContainEqual', 'toMatchObject'];

const assert = ({
  given = undefined,
  should = '',
  actual = undefined,
  expected = undefined,
} = {}) => {
  it(`given ${given}\n\t should ${should}`, () => {
    expect(actual).toEqual(expected);
  });
};

assertFns.forEach(method => {
  assert[method] = ({
    given = undefined,
    should = '',
    actual = undefined,
    expected = undefined,
  } = {}) => {
    it(`given ${given}\n\t should ${should}`, () => {
      expect(actual)[method](expected);
    });
  };
});

assert.skip = ({
  given = undefined,
  should = '',
  actual = undefined,
  expected = undefined,
} = {}) => {
  it.skip(`given ${given}\n\t should ${should}`, () => {
    expect(actual).toEqual(expected);
  });
};

assert.only = ({
  given = undefined,
  should = '',
  actual = undefined,
  expected = undefined,
} = {}) => {
  it.only(`given ${given}\n\t should ${should}`, () => {
    expect(actual).toEqual(expected);
  });
};

export {assert};
