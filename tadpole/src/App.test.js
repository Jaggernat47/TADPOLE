import { fireEvent, render, screen, within } from '@testing-library/react';
import { webcrypto } from 'crypto';
import { TextEncoder } from 'util';
import App from './App';

// Reset browser state before each test so cases do not affect one another.
beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState({}, '', '/');
  Object.defineProperty(window, 'crypto', { configurable: true, value: webcrypto });
  global.TextEncoder = TextEncoder;
});

// Creates a signed-in test player with optional account fields overridden.
function saveTestAccount(overrides = {}) {
  const account = {
    username: 'TestPlayer',
    passwordSalt: '00112233445566778899aabbccddeeff',
    passwordHash: '00'.repeat(32),
    profile: { name: 'Test Player', bio: 'Ready to play.', avatar: '👾', accent: '#00ff66' },
    ownedGames: [],
    badges: [],
    ...overrides,
  };
  window.localStorage.setItem('tadpole-demo-accounts', JSON.stringify({ testplayer: account }));
  window.localStorage.setItem('tadpole-active-user', 'testplayer');
  return account;
}

// Changes the query-string route and notifies React as a browser navigation would.
function navigateTo(search) {
  window.history.pushState({}, '', search || '/');
  fireEvent(window, new PopStateEvent('popstate'));
}

// Opens the cart route in tests that first add an item from the storefront.
function cartPage() {
  navigateTo('?cart');
}

// Storefront, account, checkout, wishlist, product, careers, and demo regressions.
test('renders the PixelPlay storefront and game library', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /retro gaming/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /game library/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Towers VS Zombies' })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'Towers VS Zombies artwork' }).querySelector('img')).toHaveAttribute(
    'src',
    '/images/towers-vs-zombies.png',
  );
  expect(screen.getByRole('heading', { name: 'Dragon Keep III' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Player profile' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute('href', '?auth');
  expect(screen.queryByRole('heading', { name: 'My Profile' })).not.toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'My Games' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Wishlist' })).toHaveAttribute('href', '?wishlist');
  expect(screen.getByRole('link', { name: 'Shopping cart' })).toHaveAttribute('href', '?cart');
  const mainNavigation = screen.getByRole('navigation', { name: 'Main navigation' });
  expect(within(mainNavigation).getAllByRole('link').map((link) => link.textContent)).toEqual([
    'Games',
    'Hardware',
    'About',
    'Support',
  ]);
  expect(screen.queryByRole('button', { name: 'Get Console' })).not.toBeInTheDocument();
});

test('plays a short dinosaur jump animation when Start is pressed', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'PRESS START_' }));
  expect(screen.getByRole('img', { name: 'Dinosaur jumps over a cactus' })).toBeInTheDocument();
});

test('shows the Tadpole Hall of Fame with the credited team photos and roles', () => {
  render(<App />);

  const aboutSection = document.querySelector('#about');
  const websiteDescription = within(aboutSection).getByText(
    'Tadpole brings together original arcade-inspired adventures and lovingly rebuilt classics, made to be played, shared, and collected.',
  );
  const hallOfFame = within(aboutSection).getByRole('heading', { name: 'The Tadpole Hall of Fame' });
  expect(websiteDescription).toBeInTheDocument();
  expect(websiteDescription.compareDocumentPosition(hallOfFame) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(screen.getByRole('img', { name: 'Chrysgel Abesamis' })).toHaveAttribute(
    'src',
    '/images/team/chrysgel-abesamis.jpg',
  );
  expect(screen.getByText('CEO of ARCTOAD / Lead Developer')).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'Lioneil Fergus Alarcon' })).toHaveAttribute(
    'src',
    '/images/team/lioneil-fergus-alarcon.jpg',
  );
  expect(screen.getByText('Head of Staff / Frontend Developer')).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'Lanily Vacunawa' })).toHaveAttribute(
    'src',
    '/images/team/lanily-vacunawa.jpg',
  );
  expect(screen.getByText('Lead Designer / Frontend Developer')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Explore Open Roles' })).toHaveAttribute('href', '?careers');
});

test('lists careers and saves a role-specific application in this browser', () => {
  window.history.replaceState({}, '', '/?careers&role=game-developer');
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Join the Tadpole crew' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Open Roles' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Game Developer' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Frontend Developer' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Software Engineer' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Game Designer' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Community & Support Specialist' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Store Operations Administrator' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Apply: Game Developer' })).toBeInTheDocument();
  expect(screen.getByText(/not delivered to a hiring team/i)).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText('YOUR NAME'), { target: { value: 'Pixel Player' } });
  fireEvent.change(screen.getByLabelText('EMAIL ADDRESS'), { target: { value: 'player@example.com' } });
  fireEvent.change(screen.getByLabelText('INTRODUCTION'), { target: { value: 'I build fun games.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save Application' }));

  expect(screen.getByRole('status')).toHaveTextContent(
    'Application for Game Developer saved in this browser. It has not been sent to an employer.',
  );
  expect(JSON.parse(window.localStorage.getItem('tadpole-job-applications'))[0]).toMatchObject({
    roleId: 'game-developer',
    roleTitle: 'Game Developer',
    name: 'Pixel Player',
    email: 'player@example.com',
    coverNote: 'I build fun games.',
  });
});

test('filters games by category', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'RPG' }));

  expect(screen.getByRole('heading', { name: 'Dragon Keep III' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Towers VS Zombies' })).not.toBeInTheDocument();
});

test('adds a game to the saved cart and updates its quantity', () => {
  render(<App />);

  const gameCard = screen.getByRole('heading', { name: 'Towers VS Zombies' }).closest('article');
  fireEvent.click(within(gameCard).getByRole('button', { name: 'Add to Cart' }));

  expect(screen.getByText('Towers VS Zombies added to your cart.')).toBeInTheDocument();
  expect(window.localStorage.getItem('retroCart')).toContain('"name":"Towers VS Zombies"');
  cartPage();
  expect(screen.getByRole('heading', { name: 'Shopping Cart' })).toBeInTheDocument();
  expect(screen.getAllByText('$34.00')).toHaveLength(2);

  fireEvent.click(screen.getByRole('button', { name: 'Increase Towers VS Zombies quantity' }));
  expect(screen.getAllByText('$68.00')).toHaveLength(2);
});

test('refreshes saved Tower Defense names in existing cart and wishlist data', () => {
  window.localStorage.setItem('retroCart', JSON.stringify([{
    gameId: 'neon-drift',
    name: 'Tower Defense',
    price: 34,
    category: 'Strategy',
    quantity: 1,
  }]));
  window.localStorage.setItem('tadpole-wishlist', JSON.stringify([{
    gameId: 'neon-drift',
    name: 'Tower Defense',
    price: 34,
    category: 'Strategy',
    quantity: 1,
  }]));
  window.history.replaceState({}, '', '/?cart');
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Towers VS Zombies' })).toBeInTheDocument();
  navigateTo('?wishlist');
  expect(screen.getByRole('heading', { name: 'Towers VS Zombies' })).toBeInTheDocument();
});

test('adds purchased games to My Games after checkout', () => {
  saveTestAccount();
  const { unmount } = render(<App />);

  const gameCard = screen.getByRole('heading', { name: 'Towers VS Zombies' }).closest('article');
  fireEvent.click(within(gameCard).getByRole('button', { name: 'Add to Cart' }));
  cartPage();
  fireEvent.click(screen.getByRole('radio', { name: 'PayPal' }));
  fireEvent.click(screen.getByRole('button', { name: 'Proceed to Checkout' }));

  expect(screen.getByText(/Demo order complete with PayPal\. No payment was processed\./)).toBeInTheDocument();
  expect(JSON.parse(window.localStorage.getItem('tadpole-demo-accounts')).testplayer.ownedGames).toContain('neon-drift');
  expect(window.localStorage.getItem('retroCart')).toBe('[]');

  unmount();
  window.history.replaceState({}, '', '/?profile');
  render(<App />);
  expect(within(document.querySelector('.profile-page')).getByRole('heading', { name: 'Towers VS Zombies' })).toBeInTheDocument();
});

test('wishlist saves games and hardware and moves items into the cart', () => {
  const { unmount } = render(<App />);
  const gameCard = screen.getByRole('heading', { name: 'Towers VS Zombies' }).closest('article');
  fireEvent.click(within(gameCard).getByRole('button', { name: '♥ Wishlist' }));
  expect(window.localStorage.getItem('tadpole-wishlist')).toContain('neon-drift');

  const hardwareCard = screen.getByRole('heading', { name: 'Controller' }).closest('article');
  fireEvent.click(within(hardwareCard).getByRole('button', { name: '♥ Add to Wishlist' }));
  unmount();
  navigateTo('?wishlist');
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Wishlist' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Towers VS Zombies' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Controller' })).toBeInTheDocument();
  const gameWishlistItem = screen.getByRole('heading', { name: 'Towers VS Zombies' }).closest('article');
  fireEvent.click(within(gameWishlistItem).getByRole('button', { name: 'Add to Cart' }));
  expect(window.localStorage.getItem('retroCart')).toContain('neon-drift');
  expect(window.localStorage.getItem('tadpole-wishlist')).not.toContain('neon-drift');
});

test('opens a hardware detail page with specifications', () => {
  const { unmount } = render(<App />);
  expect(screen.getByRole('link', { name: 'Gaming Console' })).toHaveAttribute('href', '?hardware=gaming-console');
  unmount();
  navigateTo('?hardware=gaming-console');
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Gaming Console' })).toBeInTheDocument();
  expect(screen.getByText('4.3-inch color LCD')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Ratings & Reviews' })).toBeInTheDocument();
  expect(screen.getByText(/product artwork is an illustration/i)).toBeInTheDocument();
});

test('submits hardware ratings and comments and calculates the average', () => {
  window.history.replaceState({}, '', '/?hardware=controller');
  const { unmount } = render(<App />);

  fireEvent.change(screen.getByLabelText('YOUR NAME'), { target: { value: 'ArcadeFan' } });
  fireEvent.click(screen.getByRole('radio', { name: '5 stars' }));
  fireEvent.change(screen.getByLabelText('YOUR REVIEW'), { target: { value: 'Comfortable and responsive.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Post Review' }));

  expect(screen.getByText('Thanks! Your review has been posted on this browser.')).toBeInTheDocument();
  expect(screen.getByText(/5\.0 out of 5 based on 1 review/)).toBeInTheDocument();
  expect(screen.getByText('Comfortable and responsive.')).toBeInTheDocument();
  expect(JSON.parse(window.localStorage.getItem('tadpole-hardware-reviews-controller'))[0]).toMatchObject({
    name: 'ArcadeFan',
    rating: 5,
    comment: 'Comfortable and responsive.',
  });

  unmount();
  render(<App />);
  expect(screen.getByText('Comfortable and responsive.')).toBeInTheDocument();
  expect(screen.getByText(/5\.0 out of 5 based on 1 review/)).toBeInTheDocument();
});

test('checkout requires a payment selection and preserves cart when signed out', () => {
  render(<App />);
  const gameCard = screen.getByRole('heading', { name: 'Towers VS Zombies' }).closest('article');
  fireEvent.click(within(gameCard).getByRole('button', { name: 'Add to Cart' }));
  cartPage();

  fireEvent.click(screen.getByRole('button', { name: 'Proceed to Checkout' }));
  expect(screen.getByText('Select a payment method to continue.')).toBeInTheDocument();
  expect(window.localStorage.getItem('retroCart')).toContain('neon-drift');
  fireEvent.click(screen.getByRole('radio', { name: 'Visa' }));
  fireEvent.click(screen.getByRole('button', { name: 'Proceed to Checkout' }));
  expect(window.location.search).toBe('?auth');
  expect(window.localStorage.getItem('retroCart')).toContain('neon-drift');
});

test('saves a customizable player profile', () => {
  saveTestAccount();
  window.history.replaceState({}, '', '/?profile');
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
  fireEvent.change(screen.getByLabelText('PLAYER NAME'), { target: { value: 'Pixel Frog' } });
  fireEvent.change(screen.getByLabelText('DESCRIPTION'), { target: { value: 'High score hunter.' } });
  fireEvent.click(screen.getByRole('radio', { name: '🚀' }));
  fireEvent.click(screen.getByRole('radio', { name: 'Neon blue' }));
  fireEvent.click(screen.getByRole('button', { name: 'Save Profile' }));

  expect(screen.getByRole('heading', { name: 'Pixel Frog' })).toBeInTheDocument();
  expect(screen.getByText('High score hunter.')).toBeInTheDocument();
  const savedAccount = JSON.parse(window.localStorage.getItem('tadpole-demo-accounts')).testplayer;
  expect(savedAccount.profile).toMatchObject({
    name: 'Pixel Frog',
    bio: 'High score hunter.',
    avatar: '🚀',
    accent: '#4cc9f0',
  });
});

test('shows earned game badges in the profile showcase', () => {
  saveTestAccount({ badges: ['demo-lost-caves'] });
  window.history.replaceState({}, '', '/?profile');
  render(<App />);

  const profile = document.querySelector('.profile-page');
  expect(within(profile).getByRole('heading', { name: 'Cave Scout' })).toBeInTheDocument();
  expect(within(profile).getByText('1 BADGE')).toBeInTheDocument();
});

test('opens the demo page from the game query parameter', () => {
  saveTestAccount();
  window.history.replaceState({}, '', '/?game=lost-caves');
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Lost Caves' })).toBeInTheDocument();
  expect(screen.getByText(/precision platformer with procedural cave systems/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Comments' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Start Demo' }));
  expect(screen.getByRole('button', { name: 'Achievement Earned' })).toBeDisabled();
  expect(JSON.parse(window.localStorage.getItem('tadpole-demo-accounts')).testplayer.badges).toContain('demo-lost-caves');
});

test('loads Towers VS Zombies in its responsive game window', () => {
  saveTestAccount();
  window.history.replaceState({}, '', '/?game=neon-drift');
  render(<App />);

  const gameFrame = screen.getByTitle('Towers VS Zombies playable demo');
  expect(gameFrame).toHaveAttribute('src', '/games/tower-defense/index.html');
  expect(gameFrame).toHaveAttribute('allowfullscreen');
  expect(gameFrame.parentElement).toHaveClass('arcade-screen--playable');
  expect(screen.queryByText('COMING SOON')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Earn Sample Badge' }));
  expect(screen.getByRole('button', { name: 'Achievement Earned' })).toBeDisabled();
  expect(JSON.parse(window.localStorage.getItem('tadpole-demo-accounts')).testplayer.badges).toContain('demo-neon-drift');
});

test('creates an account, signs out, and signs back in', async () => {
  window.history.replaceState({}, '', '/?auth');
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Create one' }));
  fireEvent.change(screen.getByLabelText('USERNAME'), { target: { value: 'NewPlayer' } });
  fireEvent.change(screen.getByLabelText('PASSWORD'), { target: { value: 'correct-horse-1' } });
  fireEvent.change(screen.getByLabelText('CONFIRM PASSWORD'), { target: { value: 'correct-horse-1' } });
  fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

  const profileLink = await screen.findByRole('link', { name: 'Player profile' });
  expect(profileLink).toHaveAttribute('href', '?profile');
  const accounts = JSON.parse(window.localStorage.getItem('tadpole-demo-accounts'));
  expect(accounts.newplayer.passwordHash).not.toContain('correct-horse-1');
  expect(accounts.newplayer.passwordSalt).toHaveLength(32);
  expect(window.localStorage.getItem('tadpole-active-user')).toBe('newplayer');

  navigateTo('?profile');
  fireEvent.click(screen.getByRole('button', { name: 'Sign Out' }));
  expect(screen.queryByRole('link', { name: 'Player profile' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument();
  expect(window.localStorage.getItem('tadpole-active-user')).toBeNull();

  navigateTo('?auth');
  fireEvent.change(screen.getByLabelText('USERNAME'), { target: { value: 'newplayer' } });
  fireEvent.change(screen.getByLabelText('PASSWORD'), { target: { value: 'incorrect-password' } });
  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
  expect(await screen.findByText('Username or password is incorrect.')).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText('PASSWORD'), { target: { value: 'correct-horse-1' } });
  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

  expect(await screen.findByRole('link', { name: 'Player profile' })).toBeInTheDocument();
});
