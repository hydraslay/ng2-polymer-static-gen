import { GeneratorPage } from './app.po';

describe('generator App', function() {
  let page: GeneratorPage;

  beforeEach(() => {
    page = new GeneratorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
