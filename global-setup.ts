import * as fs from 'fs';
import * as path from 'path';

async function globalSetup() {
  // Generate random credentials once for all workers
  const sharedState = {
    randomEmail: `qa_engineer_${Math.random().toString(36).substring(7)}@gmail.com`,
    password: 'Password123!'
  };

  // Save to a JSON file
  const statePath = path.join(__dirname, 'shared-state.json');
  fs.writeFileSync(statePath, JSON.stringify(sharedState, null, 2));

  console.log(`✓ Global setup complete. Generated email: ${sharedState.randomEmail}`);
}

export default globalSetup;
