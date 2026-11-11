import { useEffect, useState } from 'react';
import './App.css';

// Catalog data: these objects power the game and hardware cards across the store.
const games = [
  {
    id: 'neon-drift',
    title: 'Towers VS Zombies',
    category: 'Strategy',
    year: 2024,
    price: 34,
    description: 'Build defenses, manage your resources, and protect the kingdom from incoming enemy waves.',
    artwork: 'tower-defense',
    symbol: 'TD',
  },
  {
    id: 'dragon-keep-iii',
    title: 'Dragon Keep III',
    category: 'RPG',
    year: 2024,
    price: 29,
    description: 'An epic 8-bit fantasy RPG with 40+ hours of gameplay and a fully orchestrated chiptune score.',
    artwork: 'dragon',
    symbol: 'DK',
  },
  {
    id: 'galactic-siege',
    title: 'Galactic Siege',
    category: 'Shoot-em-up',
    year: 2024,
    price: 24,
    description: 'A faithful remake of the 1984 arcade classic, rebuilt with modern pixel art and new stages.',
    artwork: 'galactic',
    symbol: 'GS',
  },
  {
    id: 'pixel-puncher',
    title: 'Pixel Puncher',
    category: 'Fighting',
    year: 2024,
    price: 29,
    description: '16 fighters, 32 stages. Built with classic 6-button controls and a frame-data-perfect engine.',
    artwork: 'puncher',
    symbol: 'PP',
  },
  {
    id: 'lost-caves',
    title: 'Lost Caves',
    category: 'Platformer',
    year: 2024,
    price: 19,
    description: 'Precision platformer with procedural cave systems. Each run is different.',
    artwork: 'caves',
    symbol: 'LC',
  },
  {
    id: 'black-raider',
    title: 'Black Raider',
    category: 'Puzzle',
    year: 2024,
    price: 14,
    description: 'A modern take on the classic block-pushing puzzle genre. 200 hand-crafted levels.',
    artwork: 'raider',
    symbol: 'BR',
  },
];

const hardware = [
  {
    id: 'gaming-console',
    name: 'Gaming Console',
    price: 35,
    category: 'Hardware',
    description:
      'Our custom handheld console is designed for retro gaming enthusiasts, with a high-resolution screen, responsive controls, and a library of pixel-art games.',
    artwork: 'console',
    symbol: '▰',
    tagline: 'Your whole arcade, in your hands.',
    specs: [
      ['Display', '4.3-inch color LCD'],
      ['Controls', 'D-pad, action buttons, start and select'],
      ['Library', 'Pixel-art classics and original games'],
      ['Connectivity', 'USB-C charging'],
      ['In the box', 'Handheld console and USB-C cable'],
    ],
  },
  {
    id: 'controller',
    name: 'Controller',
    price: 38,
    category: 'Hardware',
    description:
      'A comfortable, precise controller with responsive buttons and a classic D-pad, designed to connect seamlessly to PixelPlay.',
    artwork: 'controller',
    symbol: '✣',
    tagline: 'The feel of the arcade. The comfort of home.',
    specs: [
      ['Layout', 'Classic D-pad and four action buttons'],
      ['Connection', 'Wireless Bluetooth'],
      ['Compatibility', 'PixelPlay console and supported devices'],
      ['Power', 'Rechargeable battery'],
      ['In the box', 'Controller and USB-C charging cable'],
    ],
  },
];

// Careers data: each role is shown on the careers page and selected by its stable ID.
const jobOpenings = [
  {
    id: 'game-developer',
    title: 'Game Developer',
    team: 'Game Studio',
    type: 'Creative',
    description: 'Build and polish the gameplay systems behind original Tadpole games and playable demos.',
    skills: 'GameMaker or Unity, gameplay scripting, debugging',
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    team: 'Web Experience',
    type: 'Engineering',
    description: 'Create responsive storefront, profile, and community experiences for players.',
    skills: 'React, JavaScript, CSS, accessibility',
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    team: 'Platform',
    type: 'Engineering',
    description: 'Design reliable services and integrations for accounts, game libraries, and the store.',
    skills: 'JavaScript or TypeScript, APIs, testing',
  },
  {
    id: 'game-designer',
    title: 'Game Designer',
    team: 'Game Studio',
    type: 'Creative',
    description: 'Shape game mechanics, levels, progression, and the feel of each Tadpole adventure.',
    skills: 'Level design, prototyping, clear design docs',
  },
  {
    id: 'community-manager',
    title: 'Community & Support Specialist',
    team: 'Player Community',
    type: 'Community',
    description: 'Welcome players, answer questions, and help make the Tadpole community a great place to play.',
    skills: 'Communication, moderation, player support',
  },
  {
    id: 'store-admin',
    title: 'Store Operations Administrator',
    team: 'Operations',
    type: 'Operations',
    description: 'Help maintain game and hardware listings, organize store content, and keep daily operations running smoothly.',
    skills: 'Organization, careful data entry, customer service',
  },
];

// Browser-storage keys keep saved demo data organized by feature.
const categories = ['All', 'Racing', 'Strategy', 'RPG', 'Shoot-em-up', 'Fighting', 'Platformer', 'Puzzle'];
const cartStorageKey = 'retroCart';
const wishlistStorageKey = 'tadpole-wishlist';
const hardwareReviewsStorageKey = 'tadpole-hardware-reviews';
const accountsStorageKey = 'tadpole-demo-accounts';
const activeUserStorageKey = 'tadpole-active-user';
const jobApplicationsStorageKey = 'tadpole-job-applications';
const passwordIterations = 120000;

// Profile and badge defaults are reused when accounts are created or older data is loaded.
const avatarOptions = ['👾', '🕹️', '🚀', '🐸', '⭐', '🎮'];
const accentOptions = [
  { name: 'Arcade green', value: '#00ff66' },
  { name: 'Neon blue', value: '#4cc9f0' },
  { name: 'Pixel purple', value: '#c084fc' },
  { name: 'Power pink', value: '#ff5da2' },
  { name: 'Coin gold', value: '#ffd166' },
];
const defaultProfile = {
  name: 'Player One',
  bio: 'Ready for a new adventure.',
  avatar: avatarOptions[0],
  accent: accentOptions[0].value,
};
const demoBadges = games.map((game, index) => ({
  id: `demo-${game.id}`,
  gameId: game.id,
  gameTitle: game.title,
  title: ['First Lap', 'Tiny Hero', 'Space Cadet', 'Rookie Fighter', 'Cave Scout', 'Puzzle Starter'][index],
  description: 'Started the game demo.',
  icon: ['🏁', '🐉', '🚀', '🥊', '💎', '🧩'][index],
}));

// Safely loads a saved array and removes entries that do not match the feature's data rules.
function readStoredList(key, validate) {
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return { value: [], error: '' };
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new Error('Stored data is not a list.');
    return { value: parsed.filter(validate), error: '' };
  } catch (error) {
    return { value: [], error: 'Saved data could not be loaded in this browser.' };
  }
}

// Checks that a cart item has the fields and values checkout expects.
function validCartItem(item) {
  return (
    item &&
    typeof item.name === 'string' &&
    Number.isFinite(Number(item.price)) &&
    Number(item.price) >= 0 &&
    typeof item.category === 'string' &&
    Number.isInteger(Number(item.quantity)) &&
    Number(item.quantity) > 0
  );
}

// Checks a wishlist entry using the same product fields as a cart item.
function validWishlistItem(item) {
  return validCartItem({ ...item, quantity: 1 });
}

// Creates a stable key used to compare games and hardware in carts or wishlists.
function getProductId(product) {
  return product.gameId
    ? `game-${product.gameId}`
    : `hardware-${product.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

// Converts a game catalog entry into the smaller object stored in cart and wishlist data.
function getGameProduct(game) {
  return {
    gameId: game.id,
    name: game.title,
    price: game.price,
    category: game.category,
  };
}

// Refreshes saved game details so renamed or updated catalog items show current information.
function refreshSavedProduct(product) {
  const game = games.find((item) => item.id === product.gameId);
  return game ? { ...product, ...getGameProduct(game) } : product;
}

// Converts a hardware catalog entry into the common store-item format.
function getHardwareProduct(product) {
  return { name: product.name, price: product.price, category: product.category };
}

// Verifies that an account's owned-game ID still exists in the catalog.
function validOwnedGame(id) {
  return typeof id === 'string' && games.some((game) => game.id === id);
}

// Verifies that an account's badge ID still exists in the badge list.
function validBadge(id) {
  return typeof id === 'string' && demoBadges.some((badge) => badge.id === id);
}

// Normalizes usernames so sign-in lookup is case-insensitive.
function getAccountKey(username) {
  return username.trim().toLowerCase();
}

// Reads all locally saved demo accounts and rejects invalid stored data.
function readAccounts() {
  const stored = window.localStorage.getItem(accountsStorageKey);
  if (!stored) return {};
  const accounts = JSON.parse(stored);
  if (!accounts || typeof accounts !== 'object' || Array.isArray(accounts)) {
    throw new Error('Saved accounts are invalid. Clear this browser’s Tadpole account data to continue.');
  }
  return accounts;
}

// Restores the active browser session and validates its profile, games, and badges.
function loadActiveUser() {
  try {
    const username = window.localStorage.getItem(activeUserStorageKey);
    if (!username) return { user: null, error: '' };
    const account = readAccounts()[username];
    if (!account || typeof account.username !== 'string') {
      return { user: null, error: 'The saved sign-in session is invalid. Please sign in again.' };
    };
    return {
      user: {
        username: account.username,
        profile: readAccountProfile(account.profile),
        ownedGames: Array.isArray(account.ownedGames) ? account.ownedGames.filter(validOwnedGame) : [],
        badges: Array.isArray(account.badges) ? account.badges.filter(validBadge) : [],
        passwordSalt: account.passwordSalt,
        passwordHash: account.passwordHash,
      },
      error: '',
    };
  } catch (error) {
    return { user: null, error: error.message || 'Could not load saved accounts.' };
  }
}

// Fills missing or invalid profile fields with safe defaults.
function readAccountProfile(profile) {
  if (!profile || typeof profile !== 'object') return { ...defaultProfile };
  return {
    name: typeof profile.name === 'string' ? profile.name : defaultProfile.name,
    bio: typeof profile.bio === 'string' ? profile.bio : defaultProfile.bio,
    avatar: avatarOptions.includes(profile.avatar) ? profile.avatar : defaultProfile.avatar,
    accent: accentOptions.some((option) => option.value === profile.accent)
      ? profile.accent
      : defaultProfile.accent,
  };
}

// Saves one account while preserving other accounts stored in this browser.
function saveAccount(account) {
  const accounts = readAccounts();
  accounts[getAccountKey(account.username)] = account;
  window.localStorage.setItem(accountsStorageKey, JSON.stringify(accounts));
}

// Converts cryptographic bytes into a compact hexadecimal string for local storage.
function bytesToHex(bytes) {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// Creates a salted PBKDF2 hash so the demo does not store a plain-text password.
async function hashPassword(password, salt) {
  if (!window.crypto?.subtle || !window.crypto?.getRandomValues) {
    throw new Error('Secure browser cryptography is unavailable. Use HTTPS or localhost.');
  }
  const key = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const result = await window.crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: passwordIterations },
    key,
    256,
  );
  return bytesToHex(result);
}

// Compares password hashes without stopping at the first differing character.
function equalHashes(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string' || left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

// Finds the game selected by the URL, falling back to the first catalog entry.
function getSelectedGame() {
  const gameId = new URLSearchParams(window.location.search).get('game');
  return games.find((game) => game.id === gameId) || games[0];
}

// Renders the game's artwork, using the supplied logo for Towers VS Zombies.
function GameArtwork({ game, compact = false }) {
  return (
    <div
      className={`game-art game-art--${game.artwork}${compact ? ' game-art--compact' : ''}`}
      aria-label={`${game.title} artwork`}
      role="img"
    >
      {game.id === 'neon-drift' ? (
        <img
          className="game-art__image"
          src={`${process.env.PUBLIC_URL}/images/towers-vs-zombies.png`}
          alt=""
        />
      ) : (
        <>
          <span className="game-art__grid" />
          <span className="game-art__symbol">{game.symbol}</span>
          <span className="game-art__title">{game.title}</span>
        </>
      )}
    </div>
  );
}

// Makes the glowing PRESS START prompt play a short dinosaur-and-cactus animation.
function GameBoyEasterEgg() {
  const [animationRun, setAnimationRun] = useState(0);

  useEffect(() => {
    if (!animationRun) return undefined;

    const animationTimer = window.setTimeout(() => setAnimationRun(0), 1600);
    return () => window.clearTimeout(animationTimer);
  }, [animationRun]);

  function startAnimation() {
    setAnimationRun((run) => run + 1);
  }

  return (
    <div className="hero-display">
      <div className="hero-sun" />
      <div className="hero-console">
        <span className={`console-screen${animationRun ? ' console-screen--playing' : ''}`}>
          {animationRun ? (
            <span key={animationRun} className="console-game-animation" role="img" aria-label="Dinosaur jumps over a cactus">
              <span className="console-dinosaur" aria-hidden="true">🦖</span>
              <span className="console-cactus" aria-hidden="true">🌵</span>
            </span>
          ) : (
            <span>TADPOLE<br /></span>
          )}
        </span>
        <span className="console-controls">
          <i /><i /><i /><i />
        </span>
      </div>
      <button className="hero-display-label" type="button" onClick={startAnimation}>
        PRESS START_
      </button>
    </div>
  );
}

// Draws the console or controller illustration from inline SVG shapes.
function HardwareArtwork({ product, className = '' }) {
  return (
    <div className={`hardware-visual hardware-visual--${product.artwork} ${className}`} role="img" aria-label={`${product.name} product illustration`}>
      {product.artwork === 'console' ? (
        <svg viewBox="0 0 640 440" aria-hidden="true">
          <defs>
            <linearGradient id="consoleBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#515662" />
              <stop offset="0.5" stopColor="#252831" />
              <stop offset="1" stopColor="#111318" />
            </linearGradient>
            <linearGradient id="consoleScreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#164f3a" />
              <stop offset="1" stopColor="#091a20" />
            </linearGradient>
            <filter id="consoleShadow" x="-30%" y="-30%" width="160%" height="180%">
              <feDropShadow dx="0" dy="24" stdDeviation="18" floodColor="#000" floodOpacity=".65" />
            </filter>
          </defs>
          <ellipse cx="320" cy="375" rx="215" ry="30" fill="#000" opacity=".42" />
          <g filter="url(#consoleShadow)" transform="rotate(-7 320 220)">
            <path d="M170 58 Q190 35 220 36 L425 55 Q466 60 473 101 L493 320 Q496 356 462 366 L201 389 Q163 392 155 354 L135 104 Q132 70 170 58Z" fill="url(#consoleBody)" stroke="#858b98" strokeWidth="5" />
            <path d="M203 78 L417 96 Q438 98 440 120 L453 255 Q455 273 435 275 L211 293 Q191 295 189 275 L178 103 Q176 82 203 78Z" fill="#0b0d12" stroke="#11141a" strokeWidth="8" />
            <path d="M208 91 L414 108 L429 257 L215 275Z" fill="url(#consoleScreen)" />
            <path d="M208 221 L429 205 L433 257 L214 275Z" fill="#123d31" />
            <path d="M208 238 L431 220" stroke="#37cf81" strokeWidth="3" opacity=".6" />
            <path d="M208 252 L432 235" stroke="#37cf81" strokeWidth="2" opacity=".4" />
            <path d="M226 207 L269 164 L303 197 L340 148 L400 210Z" fill="#43886b" opacity=".8" />
            <circle cx="338" cy="136" r="13" fill="#b9e889" />
            <text x="318" y="188" fill="#d5ffe2" fontSize="18" textAnchor="middle" fontFamily="monospace" letterSpacing="3">TADPOLE</text>
            <g transform="translate(207 319)">
              <path d="M0 10h52v15H0zM18-8h15v52H18z" rx="3" fill="#111318" />
              <circle cx="186" cy="11" r="11" fill="#ff5d9e" />
              <circle cx="215" cy="28" r="11" fill="#62c6ff" />
              <circle cx="215" cy="-6" r="11" fill="#ffd166" />
              <circle cx="244" cy="11" r="11" fill="#82e577" />
              <circle cx="103" cy="13" r="5" fill="#777d89" />
              <circle cx="127" cy="13" r="5" fill="#777d89" />
            </g>
          </g>
        </svg>
      ) : (
        <svg viewBox="0 0 640 440" aria-hidden="true">
          <defs>
            <linearGradient id="controllerBody" x1="0" y1="0" x2="0.9" y2="1">
              <stop offset="0" stopColor="#f4f3fa" />
              <stop offset="0.55" stopColor="#c9cad4" />
              <stop offset="1" stopColor="#858895" />
            </linearGradient>
            <filter id="controllerShadow" x="-30%" y="-30%" width="160%" height="180%">
              <feDropShadow dx="0" dy="24" stdDeviation="18" floodColor="#000" floodOpacity=".65" />
            </filter>
          </defs>
          <ellipse cx="320" cy="354" rx="220" ry="33" fill="#000" opacity=".42" />
          <g filter="url(#controllerShadow)" transform="rotate(-5 320 220)">
            <path d="M196 104 Q225 77 264 90 L320 110 L376 90 Q415 77 444 104 Q473 131 492 221 L511 302 Q517 330 494 344 Q469 359 448 336 L394 277 L246 277 L192 336 Q171 359 146 344 Q123 330 129 302 L148 221 Q167 131 196 104Z" fill="url(#controllerBody)" stroke="#f8f8ff" strokeWidth="7" />
            <path d="M193 145 Q202 118 226 119 L278 137 L271 226 L173 221Z" fill="#aaaeba" opacity=".48" />
            <path d="M447 145 Q438 118 414 119 L362 137 L369 226 L467 221Z" fill="#aaaeba" opacity=".48" />
            <path d="M188 186h55v17h-55zM207 167h17v55h-17z" rx="3" fill="#343844" />
            <circle cx="413" cy="172" r="13" fill="#e94d83" />
            <circle cx="440" cy="190" r="13" fill="#53b8ef" />
            <circle cx="386" cy="190" r="13" fill="#f3c64e" />
            <circle cx="413" cy="208" r="13" fill="#69c978" />
            <ellipse cx="285" cy="160" rx="18" ry="10" fill="#828692" />
            <ellipse cx="354" cy="160" rx="18" ry="10" fill="#828692" />
            <circle cx="310" cy="205" r="6" fill="#858a96" />
            <circle cx="330" cy="205" r="6" fill="#858a96" />
            <path d="M264 263 Q320 287 376 263" fill="none" stroke="#9a9da8" strokeWidth="4" opacity=".75" />
          </g>
        </svg>
      )}
    </div>
  );
}

// Shared header controls for wishlist, cart, and the signed-in player's profile.
function ShopShortcuts({ cartCount, wishlistCount, user }) {
  return (
    <div className="shop-shortcuts">
      <a className="shortcut-link" href="?wishlist" aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ''}`} title="Wishlist">
        <svg className="pixel-heart" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 2h3v2h4V2h3v2h2v5h-2v2h-2v2H9v2H7v-2H5v-2H3V9H1V4h2z" />
        </svg>
        {wishlistCount > 0 && <span className="shortcut-count">{wishlistCount}</span>}
      </a>
      <a className="shortcut-link" href="?cart" aria-label={`Shopping cart${cartCount ? `, ${cartCount} items` : ''}`} title="Shopping cart">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H6" />
          <circle cx="10" cy="20" r="1.3" />
          <circle cx="18" cy="20" r="1.3" />
        </svg>
        {cartCount > 0 && <span className="shortcut-count">{cartCount}</span>}
      </a>
      {user && (
        <a className="profile-link" href="?profile" aria-label="Player profile" title="Player profile">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c.5-3.4 3.2-5.5 7-5.5s6.5 2.1 7 5.5" />
          </svg>
        </a>
      )}
    </div>
  );
}

// Main storefront header, including the centered section navigation.
function Header({ cartCount, wishlistCount, user }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Tadpole home">
        TAD<span>POLE</span>
      </a>
      <nav className="site-nav" aria-label="Main navigation">
        <a href="#games">Games</a>
        <a href="#hardware">Hardware</a>
        <a href="#about">About</a>
        <a href="#support">Support</a>
      </nav>
      <div className="header-right">
        <div className="top-actions">
          {!user && <a className="button button--outline" href="?auth">Sign In</a>}
        </div>
        <ShopShortcuts cartCount={cartCount} wishlistCount={wishlistCount} user={user} />
      </div>
    </header>
  );
}

// Sign-in and account-creation form. Demo credentials stay in this browser.
function AccountPage({ onAuthenticated, initialError = '' }) {
  const [mode, setMode] = useState('signin');
  const [message, setMessage] = useState(initialError);
  const [submitting, setSubmitting] = useState(false);

  // Validates credentials, then creates a browser account or checks a sign-in.
  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get('username') || '').trim();
    const password = String(formData.get('password') || '');
    const key = getAccountKey(username);

    setMessage('');
    setSubmitting(true);
    try {
      const accounts = readAccounts();
      if (mode === 'signup') {
        const confirmation = String(formData.get('confirmPassword') || '');
        if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
          setMessage('Username must be 3–24 characters: letters, numbers, or underscores.');
          return;
        }
        if (password.length < 8) {
          setMessage('Password must be at least 8 characters.');
          return;
        }
        if (password !== confirmation) {
          setMessage('Passwords do not match.');
          return;
        }
        if (accounts[key]) {
          setMessage('That username is already registered in this browser.');
          return;
        }
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const account = {
          username,
          passwordSalt: bytesToHex(salt),
          passwordHash: await hashPassword(password, salt),
          profile: { ...defaultProfile, name: username },
          ownedGames: [],
          badges: [],
        };
        saveAccount(account);
        window.localStorage.setItem(activeUserStorageKey, key);
        onAuthenticated(account);
      } else {
        const account = accounts[key];
        if (!account || typeof account.passwordSalt !== 'string' || typeof account.passwordHash !== 'string') {
          setMessage('Username or password is incorrect.');
          return;
        }
        const salt = Uint8Array.from(
          account.passwordSalt.match(/.{1,2}/g) || [],
          (byte) => Number.parseInt(byte, 16),
        );
        if (salt.length !== 16 || !salt.every((byte) => Number.isInteger(byte) && byte >= 0 && byte <= 255)) {
          setMessage('This account data is invalid. Create a new account in this browser.');
          return;
        }
        const passwordHash = await hashPassword(password, salt);
        if (!equalHashes(passwordHash, account.passwordHash)) {
          setMessage('Username or password is incorrect.');
          return;
        }
        window.localStorage.setItem(activeUserStorageKey, key);
        onAuthenticated(account);
      }
    } catch (error) {
      setMessage(error.message || 'Could not save your account in this browser.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="account-page">
      <header className="site-header account-page-header">
        <a className="brand" href="/" aria-label="Tadpole home">TAD<span>POLE</span></a>
        <a className="button button--outline" href="/">← Back to Store</a>
      </header>
      <section className="account-panel">
        <p className="eyebrow">YOUR PLAYER ACCOUNT</p>
        <h1>{mode === 'signup' ? 'Create Account' : 'Welcome Back'}</h1>
        <p className="account-intro">
          {mode === 'signup'
            ? 'Create an account to save your profile, badges, and game library in this browser.'
            : 'Sign in to access your player profile, badges, and owned games.'}
        </p>
        <form className="account-form" onSubmit={handleSubmit}>
          <label htmlFor="accountUsername">USERNAME</label>
          <input
            id="accountUsername"
            name="username"
            type="text"
            autoComplete="username"
            minLength="3"
            maxLength="24"
            pattern="[A-Za-z0-9_]{3,24}"
            required
          />
          <label htmlFor="accountPassword">PASSWORD</label>
          <input
            id="accountPassword"
            name="password"
            type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            minLength="8"
            required
          />
          {mode === 'signup' && (
            <>
              <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength="8"
                required
              />
            </>
          )}
          <button className="button button--solid account-submit" type="submit" disabled={submitting}>
            {submitting ? 'Please wait…' : mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
          <p className="account-message" role="alert">{message}</p>
        </form>
        <p className="account-switch">
          {mode === 'signup' ? 'Already have an account?' : 'New to Tadpole?'}{' '}
          <button
            type="button"
            onClick={() => {
              setMode((current) => current === 'signin' ? 'signup' : 'signin');
              setMessage('');
            }}
          >
            {mode === 'signup' ? 'Sign in' : 'Create one'}
          </button>
        </p>
        <p className="account-notice">Demo accounts are saved only in this browser and are not secure or synced across devices.</p>
      </section>
    </main>
  );
}

// Header shared by the separate cart, wishlist, and hardware detail pages.
function ShopPageHeader({ cartCount, wishlistCount, user }) {
  return (
    <header className="site-header shop-page-header">
      <a className="brand" href="/" aria-label="Tadpole home">TAD<span>POLE</span></a>
      <div className="header-right">
        <ShopShortcuts cartCount={cartCount} wishlistCount={wishlistCount} user={user} />
        <a className="button button--outline" href="/">← Continue Shopping</a>
      </div>
    </header>
  );
}

// Cart page and demo checkout; no payment provider is contacted.
function CartPage({ cart, updateCart, user, onUserChange, onSignIn, wishlistCount }) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [message, setMessage] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  // Changes one item's quantity and removes it if the new amount reaches zero.
  function changeQuantity(index, amount) {
    const nextCart = cart
      .map((item, itemIndex) =>
        itemIndex === index ? { ...item, quantity: item.quantity + amount } : item,
      )
      .filter((item) => item.quantity > 0);
    if (!updateCart(nextCart)) setMessage('Could not update your cart in this browser.');
    else setMessage('');
  }

  // Validates checkout, records game ownership, and clears the demo cart.
  function completeDemoOrder() {
    if (!cart.length) {
      setMessage('Add an item to your cart before checking out.');
      return;
    }
    if (!paymentMethod) {
      setMessage('Select a payment method to continue.');
      return;
    }
    if (!user) {
      setMessage('Sign in before completing checkout so game purchases can be saved to your library.');
      onSignIn();
      return;
    }

    const purchasedGameIds = cart
      .map((item) => item.gameId || games.find((game) => game.title === item.name)?.id)
      .filter(validOwnedGame);
    const nextUser = { ...user, ownedGames: [...new Set([...user.ownedGames, ...purchasedGameIds])] };

    if (!updateCart([])) {
      setMessage('Could not complete the demo checkout because your cart could not be updated.');
      return;
    }
    try {
      saveAccount(nextUser);
      onUserChange(nextUser);
      setOrderComplete(true);
      setMessage(`Demo order complete with ${paymentMethod}. No payment was processed.`);
    } catch (error) {
      updateCart(cart);
      setMessage('Could not save your order to this account. Your cart has been restored.');
    }
  }

  return (
    <main className="shopping-page">
      <ShopPageHeader cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} wishlistCount={wishlistCount} user={user} />
      <div className="shopping-page-content">
        <div className="section-heading">
          <div><p className="eyebrow">READY PLAYER ONE?</p><h1>Shopping Cart</h1></div>
          <p>Review your items and choose a payment method to finish the demo checkout.</p>
        </div>
        {orderComplete ? (
          <section className="order-complete" role="status">
            <span aria-hidden="true">✓</span>
            <h2>Order complete</h2>
            <p>{message}</p>
            <a className="button button--solid" href={user ? '?profile' : '/'}>{user ? 'View My Games' : 'Back to Store'}</a>
          </section>
        ) : (
          <>
            {cart.length ? (
              <div className="cart-items">
                {cart.map((item, index) => (
                  <article className="cart-item" key={`${getProductId(item)}-${index}`}>
                    <ProductArtwork product={item} />
                    <div className="cart-details"><h3>{item.name}</h3><p>{item.category}</p></div>
                    <div className="cart-quantity" aria-label={`Quantity of ${item.name}`}>
                      <button type="button" onClick={() => changeQuantity(index, -1)} aria-label={`Decrease ${item.name} quantity`}>−</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => changeQuantity(index, 1)} aria-label={`Increase ${item.name} quantity`}>+</button>
                    </div>
                    <div className="cart-subtotal">
                      <strong>${(Number(item.price) * item.quantity).toFixed(2)}</strong>
                      <button type="button" onClick={() => changeQuantity(index, -item.quantity)}>Remove</button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-cart">
                <span className="empty-cart__icon" aria-hidden="true">▱</span>
                <h3>Your cart is empty</h3>
                <p>Browse games and hardware, then come back here to check out.</p>
                <a className="button button--outline" href="/">Explore the Store</a>
              </div>
            )}
            {cart.length > 0 && (
              <section className="checkout-panel">
                <h2>Payment Method</h2>
                <p>Choose how you would pay. This demo checkout does not process a real payment.</p>
                <div className="payment-options">
                  {['PayPal', 'Cash App', 'Visa', 'Mastercard', 'GCash', 'Maya'].map((method) => (
                    <label className={`payment-option${paymentMethod === method ? ' selected' : ''}`} key={method}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={() => {
                          setPaymentMethod(method);
                          setMessage('');
                        }}
                      />
                      <span className={`payment-option__mark payment-option__mark--${method.toLowerCase().replace(/[^a-z]+/g, '-')}`} aria-hidden="true">
                        {method === 'Mastercard' ? 'MC' : method === 'Cash App' ? '$' : method === 'PayPal' ? 'P' : method === 'Visa' ? 'V' : method === 'GCash' ? 'G' : 'M'}
                      </span>
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
                <div className="checkout-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
                <button className="button button--solid checkout-confirm" type="button" onClick={completeDemoOrder}>
                  Proceed to Checkout
                </button>
                <p className="checkout-message" role="status">{message}</p>
                {!user && <p className="checkout-signin">You’ll need to <a href="?auth">sign in</a> before completing checkout.</p>}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

// Reuses game artwork or a hardware symbol in cart and wishlist rows.
function ProductArtwork({ product }) {
  const game = games.find((item) => item.id === product.gameId);
  if (game) return <GameArtwork game={game} compact />;
  const hardwareItem = hardware.find((item) => item.name === product.name);
  return (
    <div className={`cart-item__icon${hardwareItem ? ` hardware-art--${hardwareItem.artwork}` : ''}`} aria-hidden="true">
      {hardwareItem?.symbol || '▰'}
    </div>
  );
}

// Saved products page, with actions for removing items or moving them to cart.
function WishlistPage({ wishlist, updateWishlist, cart, updateCart, user, wishlistCount }) {
  const [message, setMessage] = useState('');

  // Removes a product by its stable ID and reports whether storage succeeded.
  function removeFromWishlist(product) {
    const nextWishlist = wishlist.filter((item) => getProductId(item) !== getProductId(product));
    if (!updateWishlist(nextWishlist)) {
      setMessage('Could not update your wishlist in this browser.');
      return false;
    }
    return true;
  }

  // Adds the saved product to the cart, then removes it from the wishlist.
  function moveToCart(product) {
    const existing = cart.find((item) => getProductId(item) === getProductId(product));
    const nextCart = existing
      ? cart.map((item) => getProductId(item) === getProductId(product) ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { ...product, quantity: 1 }];
    if (!updateCart(nextCart)) {
      setMessage(`Could not add ${product.name} to your cart.`);
      return;
    }
    if (removeFromWishlist(product)) setMessage(`${product.name} moved to your cart.`);
    else setMessage(`${product.name} is in your cart, but could not be removed from your wishlist.`);
  }

  return (
    <main className="shopping-page wishlist-page">
      <ShopPageHeader cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} wishlistCount={wishlistCount} user={user} />
      <div className="shopping-page-content">
        <div className="section-heading">
          <div><p className="eyebrow">SAVE IT FOR LATER</p><h1>Wishlist</h1></div>
          <p>Your favorite games and hardware, ready when you are.</p>
        </div>
        {wishlist.length ? (
          <div className="wishlist-items">
            {wishlist.map((item) => (
              <article className="wishlist-item" key={getProductId(item)}>
                <ProductArtwork product={item} />
                <div className="cart-details"><h2>{item.name}</h2><p>{item.category}</p></div>
                <strong className="wishlist-price">${Number(item.price).toFixed(2)}</strong>
                <div className="wishlist-actions">
                  <button className="button button--solid" type="button" onClick={() => moveToCart(item)}>Add to Cart</button>
                  <button className="button button--outline" type="button" onClick={() => removeFromWishlist(item)}>Remove</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-cart">
            <span className="empty-cart__icon" aria-hidden="true">♥</span>
            <h3>Your wishlist is empty</h3>
            <p>Save a game or piece of hardware here to come back to it later.</p>
            <a className="button button--outline" href="/">Explore the Store</a>
          </div>
        )}
        <p className="checkout-message" role="status">{message}</p>
      </div>
    </main>
  );
}

// Main shop page: filters the catalog and manages cart/wishlist actions.
function Storefront({
  user,
  cart,
  wishlist,
  updateCart,
  updateWishlist,
}) {
  const [storeMessage, setStoreMessage] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const ownedGames = user?.ownedGames || [];

  // Adds one item to the cart, increasing quantity when it is already there.
  function addToCart(product) {
    if (product.gameId && ownedGames.includes(product.gameId)) {
      setStoreMessage(`${product.name} is already in your game library.`);
      return;
    }
    const existing = cart.find((item) => item.name === product.name);
    const nextCart = existing
      ? cart.map((item) =>
          item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item,
        )
      : [...cart, { ...product, quantity: 1 }];
    if (!updateCart(nextCart)) {
      setStoreMessage('Could not save your cart in this browser.');
      return;
    }
    setStoreMessage(`${product.name} added to your cart.`);
  }

  // Adds or removes one product from the wishlist.
  function toggleWishlist(product) {
    const productId = getProductId(product);
    const alreadySaved = wishlist.some((item) => getProductId(item) === productId);
    const nextWishlist = alreadySaved
      ? wishlist.filter((item) => getProductId(item) !== productId)
      : [...wishlist, product];
    if (!updateWishlist(nextWishlist)) {
      setStoreMessage('Could not save your wishlist in this browser.');
      return;
    }
    setStoreMessage(alreadySaved ? `${product.name} removed from your wishlist.` : `${product.name} saved to your wishlist.`);
  }

  // Lets product cards display the correct wishlist button state.
  function isWishlisted(product) {
    return wishlist.some((item) => getProductId(item) === getProductId(product));
  }

  return (
    <>
      <Header
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)}
        wishlistCount={wishlist.length}
        user={user}
      />
      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow">INDEPENDENT GAMES. OLD-SCHOOL SOUL.</p>
            <h1>Retro Gaming,<br /><span>Built for your gen.</span></h1>
            <p className="hero-description">
              Tadpole publishes original pixel-art games and faithful remakes — playable on our custom
              handheld console or as a physical cartridge you can hold in your hands.
            </p>
            <div className="hero-actions">
              <a className="button button--solid" href="#games">Browse Games</a>
              <a className="button button--outline" href="#hardware">Get the Console</a>
            </div>
            <div className="hero-stats">
              <span><strong>06</strong> ORIGINAL TITLES</span>
              <span><strong>01</strong> NEW WAY TO PLAY</span>
            </div>
          </div>
          <GameBoyEasterEgg />
        </section>

        <section className="games section-shell" id="games">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE PIXELPLAY COLLECTION</p>
              <h2>Game Library</h2>
            </div>
            <p>Play our way, or own it for real. Custom-printed cartridges ship in 5–7 days with a numbered label and protective case.</p>
          </div>
          <div className="games-nav" aria-label="Filter games by category">
            {categories.map((category) => (
              <button
                className={activeCategory === category ? 'category-button active' : 'category-button'}
                key={category}
                type="button"
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="game-grid">
            {games.filter((game) => activeCategory === 'All' || game.category === activeCategory).map((game) => (
              <article className="game-card" key={game.id}>
                <GameArtwork game={game} />
                <div className="game-card__body">
                  <div className="game-card__title">
                    <h3>{game.title}</h3>
                    <span>${game.price}</span>
                  </div>
                  <p className="game-meta">{game.category} <span>·</span> {game.year}</p>
                  <p className="game-description">{game.description}</p>
                  <div className="game-actions">
                    <button
                      className="button button--solid"
                      type="button"
                      disabled={ownedGames.includes(game.id)}
                      onClick={() => addToCart(getGameProduct(game))}
                    >
                      {ownedGames.includes(game.id) ? 'Owned' : 'Add to Cart'}
                    </button>
                    <button
                      className={`button button--outline wishlist-button${isWishlisted(getGameProduct(game)) ? ' is-wishlisted' : ''}`}
                      type="button"
                      aria-pressed={isWishlisted(getGameProduct(game))}
                      onClick={() => toggleWishlist(getGameProduct(game))}
                    >
                      ♥ {isWishlisted(getGameProduct(game)) ? 'Wishlisted' : 'Wishlist'}
                    </button>
                    <a className="button button--outline" href={`?game=${game.id}`}>▶ Play Demo</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="hardware section-shell" id="hardware">
          <div className="section-heading">
            <div>
              <p className="eyebrow">MADE FOR YOUR LIVING ROOM</p>
              <h2>Hardware</h2>
            </div>
            <p>Handheld comfort. Arcade-ready controls. All the nostalgia, with none of the dust.</p>
          </div>
          <div className="hardware-grid">
            {hardware.map((product) => (
              <article className="hardware-card" key={product.name}>
                <a className="hardware-card__visual-link" href={`?hardware=${product.id}`} aria-label={`View ${product.name} details`}>
                  <HardwareArtwork product={product} />
                </a>
                <div className="hardware-card__body">
                  <div className="hardware-card__title">
                    <h3><a href={`?hardware=${product.id}`}>{product.name}</a></h3>
                    <strong>${product.price}</strong>
                  </div>
                  <p>{product.description}</p>
                  <a className="button button--outline" href={`?hardware=${product.id}`}>View Details & Reviews</a>
                  <button className="button button--solid" type="button" onClick={() => addToCart(getHardwareProduct(product))}>
                    Add to Cart
                  </button>
                  <button
                    className={`button button--outline wishlist-button${isWishlisted(getHardwareProduct(product)) ? ' is-wishlisted' : ''}`}
                    type="button"
                    aria-pressed={isWishlisted(getHardwareProduct(product))}
                    onClick={() => toggleWishlist(getHardwareProduct(product))}
                  >
                    ♥ {isWishlisted(getHardwareProduct(product)) ? 'Wishlisted' : 'Add to Wishlist'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <p className="store-message" role="status" aria-live="polite">{storeMessage}</p>

        <section className="about-strip section-shell" id="about">
          <div className="about-description">
            <p className="eyebrow">SMALL TEAM. BIG PIXELS.</p>
            <h2>We make games that feel like <span>coming home.</span></h2>
            <p>Tadpole brings together original arcade-inspired adventures and lovingly rebuilt classics, made to be played, shared, and collected.</p>
          </div>
          <div className="about-team">
            <div className="about-team__heading">
              <div>
                <p className="eyebrow">THE PEOPLE BEHIND THE PIXELS</p>
                <h2>The Tadpole <span>Hall of Fame</span></h2>
              </div>
            </div>
            <p className="about-intro">Meet the team bringing Tadpole to life, from game development to the experience you play.</p>
            <div className="team-grid">
              <article className="team-card">
                <div className="team-card__portrait">
                  <img src={`${process.env.PUBLIC_URL}/images/team/chrysgel-abesamis.jpg`} alt="Chrysgel Abesamis" loading="lazy" />
                  <span>01 / TEAM MEMBER</span>
                </div>
                <div className="team-card__details">
                  <h3>Chrysgel Abesamis</h3>
                  <p>CEO of ARCTOAD / Lead Developer</p>
                </div>
              </article>
              <article className="team-card">
                <div className="team-card__portrait">
                  <img src={`${process.env.PUBLIC_URL}/images/team/lioneil-fergus-alarcon.jpg`} alt="Lioneil Fergus Alarcon" loading="lazy" />
                  <span>02 / TEAM MEMBER</span>
                </div>
                <div className="team-card__details">
                  <h3>Lioneil Fergus Alarcon</h3>
                  <p>Head of Staff / Frontend Developer</p>
                </div>
              </article>
              <article className="team-card">
                <div className="team-card__portrait">
                  <img src={`${process.env.PUBLIC_URL}/images/team/lanily-vacunawa.jpg`} alt="Lanily Vacunawa" loading="lazy" />
                  <span>03 / TEAM MEMBER</span>
                </div>
                <div className="team-card__details">
                  <h3>Lanily Vacunawa</h3>
                  <p>Lead Designer / Frontend Developer</p>
                </div>
              </article>
            </div>
          </div>
          <section className="careers-callout" aria-labelledby="careers-heading">
            <p className="eyebrow">YOUR NEXT PLAYER TWO?</p>
            <h2 id="careers-heading">Build the next level <span>with us.</span></h2>
            <p>Help us make games, tools, and experiences players love. Find a role that fits your skills and join the Tadpole crew.</p>
            <a className="button button--solid" href="?careers">Explore Open Roles</a>
          </section>
        </section>
      </main>
      <footer className="site-footer" id="support">
        <a className="brand" href="#home">TAD<span>POLE</span></a>
        <p>Need a hand? <a href="mailto:support@tadpole.example">Contact Player Support</a></p>
        <span>© 2024 TADPOLE. INSERT COIN TO CONTINUE.</span>
      </footer>
    </>
  );
}

// Checks browser-saved applications before displaying or preserving them.
function validJobApplication(application) {
  return (
    application &&
    typeof application.name === 'string' &&
    typeof application.email === 'string' &&
    typeof application.roleId === 'string' &&
    typeof application.coverNote === 'string' &&
    typeof application.submittedAt === 'string'
  );
}

// Shows available roles and a form for applying to the role selected in the URL.
function CareersPage({ selectedRoleId }) {
  const [message, setMessage] = useState('');
  const selectedRole = jobOpenings.find((role) => role.id === selectedRoleId);

  // Validates form fields and saves the application locally for this demo.
  function handleSubmit(event) {
    event.preventDefault();
    if (!selectedRole) {
      setMessage('Choose an open role before submitting an application.');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const portfolio = String(formData.get('portfolio') || '').trim();
    const coverNote = String(formData.get('coverNote') || '').trim();
    if (!name || !email || !coverNote) {
      setMessage('Complete your name, email, and introduction before submitting.');
      return;
    }

    const savedApplications = readStoredList(jobApplicationsStorageKey, validJobApplication);
    if (savedApplications.error) {
      setMessage('Saved applications could not be read, so this application was not submitted.');
      return;
    }

    // Store the role and submission time with the applicant's form details.
    const application = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      roleId: selectedRole.id,
      roleTitle: selectedRole.title,
      name,
      email,
      portfolio,
      coverNote,
      submittedAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(
        jobApplicationsStorageKey,
        JSON.stringify([application, ...savedApplications.value]),
      );
      setMessage(`Application for ${selectedRole.title} saved in this browser. It has not been sent to an employer.`);
      event.currentTarget.reset();
    } catch (error) {
      setMessage('Could not save your application in this browser. Please try again.');
    }
  }

  return (
    <main className="shopping-page careers-page">
      <header className="careers-header">
        <a className="brand" href="/" aria-label="Tadpole home">TAD<span>POLE</span></a>
        <a className="button button--outline" href="/">← Back to Store</a>
      </header>
      <div className="shopping-page-content careers-content">
        <div className="careers-hero">
          <p className="eyebrow">PRESS START ON YOUR NEXT ADVENTURE</p>
          <h1>Join the <span>Tadpole crew</span></h1>
          <p>We’re always excited to meet people who care about games, thoughtful design, and welcoming player communities. Explore the sample roles below and find where you could make an impact.</p>
        </div>
        <p className="careers-demo-note">These are sample role listings for this website demo. Applications are stored only in this browser and are not delivered to a hiring team.</p>
        <section className="careers-list" aria-labelledby="open-roles-heading">
          <div className="section-heading">
            <div><p className="eyebrow">PLAYER ONE, WE NEED YOU</p><h2 id="open-roles-heading">Open Roles</h2></div>
            <p>{jobOpenings.length} roles across game development, engineering, design, and player operations.</p>
          </div>
          <div className="job-grid">
            {jobOpenings.map((role) => (
              <article className={`job-card${selectedRole?.id === role.id ? ' job-card--selected' : ''}`} key={role.id}>
                <div className="job-card__topline"><span>{role.team}</span><span>{role.type}</span></div>
                <h3>{role.title}</h3>
                <p>{role.description}</p>
                <p className="job-card__skills"><strong>Good fit:</strong> {role.skills}</p>
                <a className="button button--outline" href={`?careers&role=${role.id}#application`}>Apply for this role</a>
              </article>
            ))}
          </div>
        </section>
        {selectedRole && (
          <section className="job-application" id="application" aria-labelledby="application-heading">
            <p className="eyebrow">APPLICATION FORM</p>
            <h2 id="application-heading">Apply: <span>{selectedRole.title}</span></h2>
            <p className="job-application__intro">Tell us a little about yourself and why this role interests you.</p>
            <form className="job-application__form" onSubmit={handleSubmit}>
              <label htmlFor="applicantName">YOUR NAME</label>
              <input id="applicantName" name="name" type="text" autoComplete="name" maxLength="80" required />
              <label htmlFor="applicantEmail">EMAIL ADDRESS</label>
              <input id="applicantEmail" name="email" type="email" autoComplete="email" maxLength="254" required />
              <label htmlFor="applicantPortfolio">PORTFOLIO OR PROFILE LINK <span>(OPTIONAL)</span></label>
              <input id="applicantPortfolio" name="portfolio" type="url" placeholder="https://" maxLength="500" />
              <label htmlFor="applicantCoverNote">INTRODUCTION</label>
              <textarea id="applicantCoverNote" name="coverNote" rows="5" maxLength="2000" placeholder="Share relevant experience, projects, or what excites you about this role." required />
              <button className="button button--solid" type="submit">Save Application</button>
              <p className="job-application__message" role="status" aria-live="polite">{message}</p>
            </form>
          </section>
        )}
      </div>
      <footer className="site-footer">
        <a className="brand" href="/">TAD<span>POLE</span></a>
        <p>Need a hand? <a href="mailto:support@tadpole.example">Contact Player Support</a></p>
        <span>© 2024 TADPOLE. INSERT COIN TO CONTINUE.</span>
      </footer>
    </main>
  );
}

// Player profile page: edit profile details, view badges, and open owned games.
function ProfilePage({ user, onUserChange, onSignOut }) {
  const [profile, setProfile] = useState(user.profile);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const ownedGames = user.ownedGames;
  const earnedBadges = user.badges;

  // Validates editable fields and saves the updated profile to the account.
  function saveProfile(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextProfile = {
      name: String(formData.get('profileName') || '').trim().slice(0, 24),
      bio: String(formData.get('profileBio') || '').trim().slice(0, 160),
      avatar: String(formData.get('profileAvatar') || ''),
      accent: String(formData.get('profileAccent') || ''),
    };
    if (
      !nextProfile.name ||
      !avatarOptions.includes(nextProfile.avatar) ||
      !accentOptions.some((option) => option.value === nextProfile.accent)
    ) {
      setProfileMessage('Choose a player name, avatar, and accent color.');
      return;
    }
    try {
      const nextUser = { ...user, profile: nextProfile };
      saveAccount(nextUser);
      setProfile(nextProfile);
      onUserChange(nextUser);
      setEditingProfile(false);
      setProfileMessage('Your profile has been saved.');
    } catch (error) {
      setProfileMessage('Could not save your profile in this browser.');
    }
  }

  return (
    <div className="profile-page" style={{ '--profile-accent': profile.accent }}>
      <header className="site-header profile-page-header">
        <a className="brand" href="/" aria-label="Tadpole home">TAD<span>POLE</span></a>
        <div className="profile-header-actions">
          <span className="profile-account-name">{user.username}</span>
          <button className="button button--outline" type="button" onClick={onSignOut}>Sign Out</button>
          <a className="button button--outline" href="/">← Back to Store</a>
        </div>
      </header>
      <main className="profile-page-content">
        <section className="profile-section section-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">PLAYER ACCOUNT</p>
              <h1>My Profile</h1>
            </div>
            <p>Your player card, earned badges, and owned games — all in one place.</p>
          </div>
          <div className="profile-card">
            <div className="profile-summary">
              <div className="profile-avatar" aria-hidden="true">{profile.avatar}</div>
              <div className="profile-identity">
                <h2>{profile.name}</h2>
                <p>{profile.bio || 'No description yet.'}</p>
              </div>
              <button
                className="button button--outline"
                type="button"
                onClick={() => setEditingProfile((editing) => !editing)}
                aria-expanded={editingProfile}
                aria-controls="profile-editor"
              >
                {editingProfile ? 'Close Editor' : 'Edit Profile'}
              </button>
            </div>
            {editingProfile && (
              <form className="profile-editor" id="profile-editor" onSubmit={saveProfile}>
                <label htmlFor="profileName">PLAYER NAME</label>
                <input id="profileName" name="profileName" type="text" maxLength="24" defaultValue={profile.name} required />
                <label htmlFor="profileBio">DESCRIPTION</label>
                <textarea id="profileBio" name="profileBio" rows="3" maxLength="160" defaultValue={profile.bio} placeholder="Tell players a little about yourself." />
                <fieldset>
                  <legend>AVATAR / ICON</legend>
                  <div className="profile-choice-list">
                    {avatarOptions.map((avatar) => (
                      <label className="avatar-choice" key={avatar}>
                        <input type="radio" name="profileAvatar" value={avatar} aria-label={avatar} defaultChecked={profile.avatar === avatar} />
                        <span aria-hidden="true">{avatar}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend>ACCENT COLOR</legend>
                  <div className="profile-choice-list">
                    {accentOptions.map((accent) => (
                      <label className="color-choice" key={accent.value} title={accent.name}>
                        <input type="radio" name="profileAccent" value={accent.value} aria-label={accent.name} defaultChecked={profile.accent === accent.value} />
                        <span style={{ '--choice-color': accent.value }} />
                      </label>
                    ))}
                  </div>
                </fieldset>
                <button className="button button--solid" type="submit">Save Profile</button>
              </form>
            )}
            <div className="badge-showcase">
              <div className="badge-showcase__heading">
                <div><p className="eyebrow">EARNED IN GAME</p><h3>Badge Showcase</h3></div>
                <span>{earnedBadges.length} {earnedBadges.length === 1 ? 'BADGE' : 'BADGES'}</span>
              </div>
              {earnedBadges.length ? (
                <div className="badge-grid">
                  {demoBadges.filter((badge) => earnedBadges.includes(badge.id)).map((badge) => (
                    <article className="badge-card" key={badge.id}>
                      <span className="badge-card__icon" aria-hidden="true">{badge.icon}</span>
                      <div><h4>{badge.title}</h4><p>{badge.gameTitle}</p></div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="badge-empty">No badges yet. Play a game demo to earn your first one.</p>
              )}
            </div>
            <p className="profile-message" role="status">{profileMessage}</p>
          </div>
        </section>

        <section className="my-games section-shell">
          <div className="section-heading">
            <div><p className="eyebrow">YOUR COLLECTION</p><h2>My Games</h2></div>
            <p>{ownedGames.length} {ownedGames.length === 1 ? 'game' : 'games'} owned</p>
          </div>
          {ownedGames.length ? (
            <div className="game-grid">
              {games.filter((game) => ownedGames.includes(game.id)).map((game) => (
                <article className="game-card owned-game-card" key={game.id}>
                  <GameArtwork game={game} />
                  <div className="game-card__body">
                    <div className="game-card__title"><h3>{game.title}</h3><span>OWNED</span></div>
                    <p className="game-meta">{game.category} <span>·</span> {game.year}</p>
                    <p className="game-description">{game.description}</p>
                    <a className="button button--solid" href={`?game=${game.id}`}>▶ Play Demo</a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="owned-empty">
              <h3>Your collection starts here.</h3>
              <p>Games you purchase at checkout will show up in this library.</p>
              <a className="button button--outline" href="/">Browse Games</a>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// Ensures a saved hardware review contains a valid name, rating, and comment.
function validHardwareReview(review) {
  return (
    review &&
    typeof review.name === 'string' &&
    typeof review.comment === 'string' &&
    Number.isInteger(review.rating) &&
    review.rating >= 1 &&
    review.rating <= 5 &&
    typeof review.date === 'string'
  );
}

// Product details page with browser-saved ratings, reviews, and store actions.
function ProductReviewPage({ product, user, cart, wishlist, updateCart, updateWishlist }) {
  const reviewsKey = `${hardwareReviewsStorageKey}-${product.id}`;
  const initialReviews = readStoredList(reviewsKey, validHardwareReview);
  const [reviews, setReviews] = useState(initialReviews.value);
  const [reviewMessage, setReviewMessage] = useState(initialReviews.error);
  const [storeMessage, setStoreMessage] = useState('');
  const [rating, setRating] = useState(0);
  const productItem = getHardwareProduct(product);
  const isWishlisted = wishlist.some((item) => getProductId(item) === getProductId(productItem));
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  // Adds the displayed hardware product to the existing cart.
  function addToCart() {
    const existing = cart.find((item) => getProductId(item) === getProductId(productItem));
    const nextCart = existing
      ? cart.map((item) =>
          getProductId(item) === getProductId(productItem)
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      : [...cart, { ...productItem, quantity: 1 }];
    setStoreMessage(updateCart(nextCart) ? `${product.name} added to your cart.` : 'Could not save your cart.');
  }

  // Adds or removes the displayed hardware product from the wishlist.
  function toggleWishlist() {
    const nextWishlist = isWishlisted
      ? wishlist.filter((item) => getProductId(item) !== getProductId(productItem))
      : [...wishlist, productItem];
    if (updateWishlist(nextWishlist)) {
      setStoreMessage(isWishlisted ? 'Removed from your wishlist.' : 'Saved to your wishlist.');
    } else {
      setStoreMessage('Could not save your wishlist.');
    }
  }

  // Validates and saves a review, then refreshes the average rating.
  function submitReview(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('reviewName') || '').trim().slice(0, 32);
    const comment = String(formData.get('reviewComment') || '').trim().slice(0, 500);
    if (!name || !comment || rating < 1 || rating > 5) {
      setReviewMessage('Enter your name, choose a star rating, and write a review.');
      return;
    }
    const nextReviews = [{
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name,
      comment,
      rating,
      date: new Date().toLocaleDateString(),
    }, ...reviews];
    try {
      window.localStorage.setItem(reviewsKey, JSON.stringify(nextReviews));
      setReviews(nextReviews);
      setRating(0);
      setReviewMessage('Thanks! Your review has been posted on this browser.');
      event.currentTarget.reset();
    } catch (error) {
      setReviewMessage('Could not save your review in this browser.');
    }
  }

  return (
    <main className="hardware-detail-page">
      <ShopPageHeader
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        user={user}
      />
      <div className="hardware-detail-content">
        <a className="detail-back-link" href="/#hardware">← Back to Hardware</a>
        <section className="hardware-detail">
          <HardwareArtwork product={product} className="hardware-detail__art" />
          <div className="hardware-detail__info">
            <p className="eyebrow">TADPOLE HARDWARE</p>
            <h1>{product.name}</h1>
            <p className="hardware-detail__tagline">{product.tagline}</p>
            <div className="product-rating-summary">
              <span className="rating-stars" aria-label={`${reviews.length ? averageRating.toFixed(1) : 'No'} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, index) => (
                  <span key={index} aria-hidden="true">{index < Math.round(averageRating) ? '★' : '☆'}</span>
                ))}
              </span>
              <strong>{reviews.length ? averageRating.toFixed(1) : 'New'}</strong>
              <a href="#hardware-reviews">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</a>
            </div>
            <p className="hardware-detail__price">${product.price.toFixed(2)}</p>
            <p className="hardware-detail__description">{product.description}</p>
            <div className="hardware-detail__actions">
              <button className="button button--solid" type="button" onClick={addToCart}>Add to Cart</button>
              <button
                className={`button button--outline wishlist-button${isWishlisted ? ' is-wishlisted' : ''}`}
                type="button"
                aria-pressed={isWishlisted}
                onClick={toggleWishlist}
              >
                ♥ {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
            </div>
            <p className="checkout-message" role="status">{storeMessage}</p>
            <p className="hardware-detail__notice">Product artwork is an illustration. Final product appearance may vary.</p>
          </div>
        </section>

        <section className="hardware-specs">
          <div>
            <p className="eyebrow">BUILT FOR PLAY</p>
            <h2>Product Details</h2>
            <p>{product.description}</p>
          </div>
          <dl>
            {product.specs.map(([label, value]) => (
              <div className="spec-row" key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </section>

        <section className="hardware-reviews" id="hardware-reviews">
          <div className="section-heading">
            <div><p className="eyebrow">PLAYER FEEDBACK</p><h2>Ratings & Reviews</h2></div>
            <p>{reviews.length ? `${averageRating.toFixed(1)} out of 5 based on ${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'}` : 'No reviews yet. Be the first to share your thoughts.'}</p>
          </div>
          <form className="hardware-review-form" onSubmit={submitReview}>
            <h3>Write a Review</h3>
            <label htmlFor="reviewName">YOUR NAME</label>
            <input id="reviewName" name="reviewName" maxLength="32" defaultValue={user?.profile.name || ''} placeholder="Enter your name" required />
            <fieldset className="rating-fieldset">
              <legend>YOUR RATING</legend>
              <div className="rating-picker" role="radiogroup" aria-label="Your rating">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    className={value <= rating ? 'rating-star selected' : 'rating-star'}
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={rating === value}
                    aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`}
                    onClick={() => setRating(value)}
                  >
                    {value <= rating ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </fieldset>
            <label htmlFor="reviewComment">YOUR REVIEW</label>
            <textarea id="reviewComment" name="reviewComment" rows="4" maxLength="500" placeholder="What did you think of this hardware?" required />
            <button className="button button--solid" type="submit">Post Review</button>
            <p className="checkout-message" role="status">{reviewMessage}</p>
          </form>
          <div className="hardware-review-list" aria-live="polite">
            {reviews.length ? reviews.map((review) => (
              <article className="hardware-review" key={review.id}>
                <header>
                  <div><h3>{review.name}</h3><span className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></div>
                  <time>{review.date}</time>
                </header>
                <p>{review.comment}</p>
              </article>
            )) : <p className="reviews-empty">No reviews yet. Your review will be the first.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}

// Game details, playable export, sample badge action, and player comments.
function DemoPage({ game, user, onUserChange, onSignIn }) {
  const storageKey = `pixelplay-comments-${game.id}`;
  const badge = demoBadges.find((item) => item.gameId === game.id);
  const hasPlayableBuild = game.id === 'neon-drift';
  const initialComments = readStoredList(
    storageKey,
    (comment) =>
      comment &&
      typeof comment.name === 'string' &&
      typeof comment.text === 'string' &&
      typeof comment.date === 'string',
  );
  const [comments, setComments] = useState(initialComments.value);
  const [message, setMessage] = useState(initialComments.error);
  const earned = Boolean(user?.badges.includes(badge.id));
  const [demoMessage, setDemoMessage] = useState('');

  // Saves the game's sample badge to the signed-in player's profile.
  function startDemo() {
    if (earned) return;
    if (!user) {
      setDemoMessage('Sign in to save your earned badge.');
      onSignIn();
      return;
    }
    const nextBadges = [...new Set([...user.badges, badge.id])];
    try {
      const nextUser = { ...user, badges: nextBadges };
      saveAccount(nextUser);
      onUserChange(nextUser);
      setDemoMessage(`${badge.title} badge earned! View it on your profile.`);
    } catch (error) {
      setDemoMessage('Could not save your badge in this browser.');
    }
  }

  // Adds a comment to this game's browser-local comment list.
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') || '').trim();
    const text = String(formData.get('comment') || '').trim();
    if (!name || !text) {
      setMessage('Enter your name and a comment before posting.');
      return;
    }

    const nextComments = [{ name, text, date: new Date().toLocaleString() }, ...comments];
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextComments));
      setComments(nextComments);
      setMessage('');
      event.currentTarget.reset();
    } catch (error) {
      setMessage('Could not save your comment in this browser.');
    }
  }

  return (
    <main className="demo-page">
      <header className="demo-nav">
        <a href="./#games">← Back to Games</a>
        {user ? (
          <a className="profile-link" href="?profile" aria-label="Player profile" title="Player profile">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 20c.5-3.4 3.2-5.5 7-5.5s6.5 2.1 7 5.5" />
            </svg>
          </a>
        ) : (
          <a className="button button--outline" href="?auth">Sign In</a>
        )}
      </header>
      <div className="demo-content">
        <p className="eyebrow">NOW PLAYING</p>
        <h1>{game.title}</h1>
        <section className="arcade-frame" aria-label={`Game window for ${game.title}`}>
          <div className="arcade-topbar"><span>PIXELPLAY ARCADE</span><span>DEMO BUILD</span></div>
          {hasPlayableBuild ? (
            <>
              <div className="arcade-screen arcade-screen--playable">
                <iframe
                  className="arcade-game"
                  src={`${process.env.PUBLIC_URL}/games/tower-defense/index.html`}
                  title={`${game.title} playable demo`}
                  allow="fullscreen; gamepad; pointer-lock"
                  allowFullScreen
                />
              </div>
              <div className="arcade-badge-action">
                <p>Play the game above, then save a starter badge to your profile.</p>
                <button className="button button--solid" type="button" onClick={startDemo} disabled={earned}>
                  {earned ? 'Achievement Earned' : 'Earn Sample Badge'}
                </button>
                <p className="demo-message" role="status">{demoMessage || (earned ? `${badge.title} badge earned.` : '')}</p>
              </div>
            </>
          ) : (
            <div className="arcade-screen">
              <GameArtwork game={game} compact />
              <div className="arcade-prompt">
                <p>GAME WINDOW<br /><span>COMING SOON</span></p>
                <button className="button button--solid" type="button" onClick={startDemo} disabled={earned}>
                  {earned ? 'Achievement Earned' : 'Start Demo'}
                </button>
                <p className="demo-message" role="status">{demoMessage || (earned ? `${badge.title} badge earned.` : 'Start the demo to earn a sample badge.')}</p>
              </div>
            </div>
          )}
        </section>
        <section className="game-details">
          <p className="eyebrow">ABOUT THIS GAME</p>
          <p>{game.description}</p>
        </section>
        <section className="comments-section">
          <div className="comments-heading">
            <div><p className="eyebrow">PLAYER COMMUNITY</p><h2>Comments</h2></div>
            <span>{comments.length} {comments.length === 1 ? 'COMMENT' : 'COMMENTS'}</span>
          </div>
          <form className="comment-form" onSubmit={handleSubmit}>
            <label htmlFor="commentName">PLAYER NAME</label>
            <input id="commentName" name="name" type="text" maxLength="32" placeholder="Enter your name" required />
            <label htmlFor="commentText">YOUR COMMENT</label>
            <textarea id="commentText" name="comment" rows="4" maxLength="500" placeholder="Share your thoughts about the game..." required />
            <button className="button button--solid" type="submit">Post Comment</button>
            <p className="cart-message" role="status">{message}</p>
          </form>
          <div className="comment-list" aria-live="polite">
            {comments.map((comment, index) => (
              <article className="comment-card" key={`${comment.date}-${index}`}>
                <header><strong>{comment.name}</strong><time>{comment.date}</time></header>
                <p>{comment.text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

// App-level state and URL routing for every page in the storefront.
function App() {
  const [authState, setAuthState] = useState(loadActiveUser);
  const [page, setPage] = useState(() => new URLSearchParams(window.location.search));
  const [cart, setCart] = useState(() => readStoredList(cartStorageKey, validCartItem).value.map(refreshSavedProduct));
  const [wishlist, setWishlist] = useState(() => readStoredList(wishlistStorageKey, validWishlistItem).value.map(refreshSavedProduct));
  const user = authState.user;

  useEffect(() => {
    // Keep the rendered page in sync when the browser Back or Forward button is used.
    function syncPage() {
      setPage(new URLSearchParams(window.location.search));
    }
    window.addEventListener('popstate', syncPage);
    return () => window.removeEventListener('popstate', syncPage);
  }, []);

  // Updates both the browser URL and React's route state.
  function navigate(search) {
    window.history.pushState({}, '', search || '/');
    setPage(new URLSearchParams(search));
  }

  // Saves cart changes first; updates the screen only when storage succeeds.
  function updateCart(items) {
    try {
      window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
      setCart(items);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Saves wishlist changes first; updates the screen only when storage succeeds.
  function updateWishlist(items) {
    try {
      window.localStorage.setItem(wishlistStorageKey, JSON.stringify(items));
      setWishlist(items);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Converts a stored account into active app state after successful sign-in.
  function handleAuthenticated(account) {
    setAuthState({
      user: {
        username: account.username,
        profile: readAccountProfile(account.profile),
        ownedGames: Array.isArray(account.ownedGames) ? account.ownedGames.filter(validOwnedGame) : [],
        badges: Array.isArray(account.badges) ? account.badges.filter(validBadge) : [],
        passwordSalt: account.passwordSalt,
        passwordHash: account.passwordHash,
      },
      error: '',
    });
    navigate('');
  }

  // Refreshes app state after an account profile, badge, or game-library update.
  function handleUserChange(account) {
    setAuthState({
      user: {
        ...account,
        profile: readAccountProfile(account.profile),
        ownedGames: Array.isArray(account.ownedGames) ? account.ownedGames.filter(validOwnedGame) : [],
        badges: Array.isArray(account.badges) ? account.badges.filter(validBadge) : [],
      },
      error: '',
    });
  }

  // Clears the active browser session and returns the player to the storefront.
  function handleSignOut() {
    window.localStorage.removeItem(activeUserStorageKey);
    setAuthState({ user: null, error: '' });
    navigate('');
  }

  // Choose which page component to render from the current query-string route.
  if (page.has('careers')) {
    return <CareersPage selectedRoleId={page.get('role')} />;
  }
  if (page.has('auth')) {
    return <AccountPage onAuthenticated={handleAuthenticated} initialError={authState.error} />;
  }
  if (page.has('profile')) {
    return user
      ? <ProfilePage user={user} onUserChange={handleUserChange} onSignOut={handleSignOut} />
      : <AccountPage onAuthenticated={handleAuthenticated} initialError={authState.error} />;
  }
  if (page.has('cart')) {
    return (
      <CartPage
        cart={cart}
        updateCart={updateCart}
        user={user}
        onUserChange={handleUserChange}
        onSignIn={() => navigate('?auth')}
        wishlistCount={wishlist.length}
      />
    );
  }
  if (page.has('wishlist')) {
    return (
      <WishlistPage
        wishlist={wishlist}
        updateWishlist={updateWishlist}
        cart={cart}
        updateCart={updateCart}
        user={user}
        wishlistCount={wishlist.length}
      />
    );
  }
  if (page.has('hardware')) {
    const product = hardware.find((item) => item.id === page.get('hardware'));
    if (product) {
      return (
        <ProductReviewPage
          product={product}
          user={user}
          cart={cart}
          wishlist={wishlist}
          updateCart={updateCart}
          updateWishlist={updateWishlist}
        />
      );
    }
  }
  if (page.has('game')) {
    return (
      <DemoPage
        game={getSelectedGame()}
        user={user}
        onUserChange={handleUserChange}
        onSignIn={() => navigate('?auth')}
      />
    );
  }
  return (
    <Storefront
      user={user}
      cart={cart}
      wishlist={wishlist}
      updateCart={updateCart}
      updateWishlist={updateWishlist}
    />
  );
}

export default App;
