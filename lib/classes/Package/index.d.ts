const Package = (/** Property to get. */prop: string, /** Replacement value when not found. */replacement?: any) => any;
/** Loads a package. */
Package.load = (/** Absolute path of package file. */pPath?: string, /** Name of package file. */pName?: string) => false|{};
/** Unloads package from memory. */
Package.unload = () => {};
/** Retrieves package name. */
Package.name = '';
/** Retrieves package version. */
Package.version = '';

export = Package;