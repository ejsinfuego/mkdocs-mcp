export interface GitBookConfig {
  apiToken: string;
  spaceId: string;
  organizationId?: string;
}

export interface PageContent {
  title: string;
  content: string;
  markdown?: string;
}

export interface GitBookPage {
  id: string;
  title: string;
  path: string;
}

export interface GitBookResponse {
  success: boolean;
  pageId?: string;
  message?: string;
  error?: string;
}

export interface DocumentationSection {
  title: string;
  description: string;
  pages: PageContent[];
}
