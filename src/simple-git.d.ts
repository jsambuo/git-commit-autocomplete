declare module 'simple-git/promise' {
    export interface SimpleGit {
      status(): Promise<{ files: Array<{ path: string, working_dir: string }> }>;
      commit(message: string, files: string[]): Promise<void>;
      // Add other methods you use from simple-git here
    }
  
    const simpleGit: (baseDir?: string) => SimpleGit;
    export default simpleGit;
  }
  