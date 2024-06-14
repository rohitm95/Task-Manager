import { LocalStorageService } from './localstorage.service';

describe('LocalStorageService', () => {
  let localStorageService: LocalStorageService;

  beforeEach(() => {
    localStorageService = new LocalStorageService();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should set and get item from local storage', () => {
    const key = 'testKey';
    const value = 'testValue';

    localStorageService.setItem(key, value);
    const retrievedValue = localStorageService.getItem(key);

    expect(retrievedValue).toEqual(value);
  });

  it('should remove item from local storage', () => {
    const key = 'testKey';
    const value = 'testValue';

    localStorageService.setItem(key, value);
    localStorageService.removeItem(key);
    const retrievedValue = localStorageService.getItem(key);

    expect(retrievedValue).toBeNull();
  });

  it('should clear local storage', () => {
    const key = 'testKey';
    const value = 'testValue';

    localStorageService.setItem(key, value);
    localStorageService.clear();
    const retrievedValue = localStorageService.getItem(key);

    expect(retrievedValue).toBeNull();
  });
});