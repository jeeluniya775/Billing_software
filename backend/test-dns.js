const dns = require('dns');

const host = 'pg-2b841aed-jeelpatel1817-9116.h.aivencloud.com';

console.log('Resolving host:', host);

dns.lookup(host, (err, address, family) => {
  if (err) {
    console.error('DNS Lookup failed:', err);
  } else {
    console.log('Resolved address:', address, 'Family: IPv', family);
  }
});
