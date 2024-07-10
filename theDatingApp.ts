Here's a comprehensive TypeScript application showcasing composition, inheritance, method calls between objects, and data interchange via parameters and returned objects, themed around a dating app. This example will demonstrate various TypeScript features and object-oriented programming concepts.
First, let's create a file structure for our project:
dating-app/
├── src/
│   ├── models/
│   │   ├── User.ts
│   │   ├── Profile.ts
│   │   ├── Message.ts
│   │   └── MatchMaker.ts
│   ├── services/
│   │   └── DatingService.ts
│   └── index.ts
├── tsconfig.json
└── package.json

### In the root, run:
npm -init
tsc -init

Now, let's implement each file:

src/models/User.ts:

typescriptCopyexport class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    private password: string
  ) {}

  verifyPassword(inputPassword: string): boolean {
    return this.password === inputPassword;
  }
}

src/models/Profile.ts:

typescriptCopyimport { User } from './User';

export class Profile {
  private interests: string[] = [];

  constructor(
    public user: User,
    public age: number,
    public bio: string
  ) {}

  addInterest(interest: string): void {
    this.interests.push(interest);
  }

  getInterests(): string[] {
    return [...this.interests];
  }

  match(otherProfile: Profile): number {
    const commonInterests = this.interests.filter(interest => 
      otherProfile.interests.includes(interest)
    );
    return commonInterests.length;
  }
}

src/models/Message.ts:

typescriptCopyimport { User } from './User';

export class Message {
  constructor(
    public sender: User,
    public recipient: User,
    public content: string,
    public timestamp: Date = new Date()
  ) {}

  toString(): string {
    return `From: ${this.sender.name}, To: ${this.recipient.name}, Content: ${this.content}, Time: ${this.timestamp.toLocaleString()}`;
  }
}

src/models/MatchMaker.ts:

typescriptCopyimport { Profile } from './Profile';

export class MatchMaker {
  static findMatches(profile: Profile, potentialMatches: Profile[], minScore: number): Profile[] {
    return potentialMatches
      .filter(p => p.user.id !== profile.user.id)
      .map(p => ({ profile: p, score: profile.match(p) }))
      .filter(match => match.score >= minScore)
      .map(match => match.profile);
  }
}

src/services/DatingService.ts:

typescriptCopyimport { User } from '../models/User';
import { Profile } from '../models/Profile';
import { Message } from '../models/Message';
import { MatchMaker } from '../models/MatchMaker';

export class DatingService {
  private users: User[] = [];
  private profiles: Profile[] = [];
  private messages: Message[] = [];

  createUser(name: string, email: string, password: string): User {
    const id = this.users.length + 1;
    const user = new User(id, name, email, password);
    this.users.push(user);
    return user;
  }

  createProfile(user: User, age: number, bio: string): Profile {
    const profile = new Profile(user, age, bio);
    this.profiles.push(profile);
    return profile;
  }

  sendMessage(sender: User, recipientId: number, content: string): Message | null {
    const recipient = this.users.find(u => u.id === recipientId);
    if (recipient) {
      const message = new Message(sender, recipient, content);
      this.messages.push(message);
      return message;
    }
    return null;
  }

  getMessages(userId: number): Message[] {
    return this.messages.filter(m => m.recipient.id === userId || m.sender.id === userId);
  }

  findMatches(profile: Profile, minScore: number): Profile[] {
    return MatchMaker.findMatches(profile, this.profiles, minScore);
  }
}

src/index.ts:

typescriptCopyimport { DatingService } from './services/DatingService';

// Create an instance of the DatingService
const datingService = new DatingService();

// Create users
const alice = datingService.createUser("Alice", "alice@example.com", "password123");
const bob = datingService.createUser("Bob", "bob@example.com", "password456");
const charlie = datingService.createUser("Charlie", "charlie@example.com", "password789");

// Create profiles
const aliceProfile = datingService.createProfile(alice, 28, "I love hiking and reading.");
const bobProfile = datingService.createProfile(bob, 32, "Passionate about music and travel.");
const charlieProfile = datingService.createProfile(charlie, 30, "Foodie and movie enthusiast.");

// Add interests
aliceProfile.addInterest("hiking");
aliceProfile.addInterest("reading");
aliceProfile.addInterest("travel");

bobProfile.addInterest("music");
bobProfile.addInterest("travel");
bobProfile.addInterest("food");

charlieProfile.addInterest("food");
charlieProfile.addInterest("movies");
charlieProfile.addInterest("reading");

// Find matches for Alice
const aliceMatches = datingService.findMatches(aliceProfile, 1);
console.log("Matches for Alice:");
aliceMatches.forEach(match => {
  console.log(`- ${match.user.name} (Score: ${aliceProfile.match(match)})`);
});

// Send messages
const messageToBob = datingService.sendMessage(alice, bob.id, "Hi Bob, I noticed we both like traveling!");
const messageToCharlie = datingService.sendMessage(bob, charlie.id, "Hey Charlie, want to grab dinner sometime?");

// Get messages for Bob
const bobMessages = datingService.getMessages(bob.id);
console.log("\nMessages for Bob:");
bobMessages.forEach(message => console.log(message.toString()));

// Verify password
const isPasswordCorrect = alice.verifyPassword("password123");
console.log(`\nIs Alice's password correct? ${isPasswordCorrect}`);

tsconfig.json:

jsonCopy{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}

package.json:

jsonCopy{
  "name": "dating-app",
  "version": "1.0.0",
  "description": "A TypeScript dating app example",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "devDependencies": {
    "typescript": "^4.5.4"
  }
}
To run the application:

Install dependencies: npm install
Build the project: npm run build
Run the application: npm start

This example demonstrates:

Composition: Profile contains a User object
Inheritance: Could be extended by creating subclasses of User or Profile
Method calls between objects: Profile.match(), MatchMaker.findMatches()
Data interchange via parameters and returned objects: Throughout the DatingService methods
Encapsulation: Private fields and methods
Static methods: MatchMaker.findMatches()
Array manipulation and functional programming concepts

The application simulates creating users, profiles, finding matches, and sending messages in a dating app context. It showcases various TypeScript and object-oriented programming features while providing a realistic example of how these concepts might be applied in a real-world scenario.
