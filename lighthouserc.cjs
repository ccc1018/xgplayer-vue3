// lighthouserc.cjs
const macChromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      numberOfRuns: 3,
      chromePath:
        process.env.CHROME_PATH || (process.platform === 'darwin' ? macChromePath : undefined),
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
