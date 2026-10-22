const createLruPolicy = require('./lru');
const createLfuPolicy = require('./lfu');

const POLICIES = {
  lru: createLruPolicy,
  lfu: createLfuPolicy,
};

function createPolicy(name = 'lru') {
  if (typeof name !== 'string') {
    throw new TypeError('Eviction policy must be a string');
  }

  const normalizedName = name.toLowerCase();

  const policyFactory = POLICIES[normalizedName];

  if (!policyFactory) {
    throw new RangeError(`Unsupported eviction policy: ${name}`);
  }

  return policyFactory();
}

module.exports = createPolicy;
