declare module 'store' {
    interface Store {
        get: (key: string) => any;
        set: (key: any, data: any) => any;
    }

    const store: Store;
    export = store;
}