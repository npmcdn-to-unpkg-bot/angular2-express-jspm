/* */ 
"format cjs";
import { Injector, PLATFORM_INITIALIZER } from 'angular2/core';
import { BaseException } from 'angular2/src/facade/exceptions';
import { ListWrapper } from 'angular2/src/facade/collection';
import { FunctionWrapper, isPresent } from 'angular2/src/facade/lang';
export class TestInjector {
    constructor() {
        this._instantiated = false;
        this._injector = null;
        this._providers = [];
        this.platformProviders = [];
        this.applicationProviders = [];
    }
    reset() {
        this._injector = null;
        this._providers = [];
        this._instantiated = false;
    }
    addProviders(providers) {
        if (this._instantiated) {
            throw new BaseException('Cannot add providers after test injector is instantiated');
        }
        this._providers = ListWrapper.concat(this._providers, providers);
    }
    createInjector() {
        var rootInjector = Injector.resolveAndCreate(this.platformProviders);
        this._injector = rootInjector.resolveAndCreateChild(ListWrapper.concat(this.applicationProviders, this._providers));
        this._instantiated = true;
        return this._injector;
    }
    execute(fn) {
        var additionalProviders = fn.additionalProviders();
        if (additionalProviders.length > 0) {
            this.addProviders(additionalProviders);
        }
        if (!this._instantiated) {
            this.createInjector();
        }
        return fn.execute(this._injector);
    }
}
var _testInjector = null;
export function getTestInjector() {
    if (_testInjector == null) {
        _testInjector = new TestInjector();
    }
    return _testInjector;
}
/**
 * Set the providers that the test injector should use. These should be providers
 * common to every test in the suite.
 *
 * This may only be called once, to set up the common providers for the current test
 * suite on teh current platform. If you absolutely need to change the providers,
 * first use `resetBaseTestProviders`.
 *
 * Test Providers for individual platforms are available from
 * 'angular2/platform/testing/<platform_name>'.
 */
export function setBaseTestProviders(platformProviders, applicationProviders) {
    var testInjector = getTestInjector();
    if (testInjector.platformProviders.length > 0 || testInjector.applicationProviders.length > 0) {
        throw new BaseException('Cannot set base providers because it has already been called');
    }
    testInjector.platformProviders = platformProviders;
    testInjector.applicationProviders = applicationProviders;
    var injector = testInjector.createInjector();
    let inits = injector.getOptional(PLATFORM_INITIALIZER);
    if (isPresent(inits)) {
        inits.forEach(init => init());
    }
    testInjector.reset();
}
/**
 * Reset the providers for the test injector.
 */
export function resetBaseTestProviders() {
    var testInjector = getTestInjector();
    testInjector.platformProviders = [];
    testInjector.applicationProviders = [];
    testInjector.reset();
}
/**
 * Allows injecting dependencies in `beforeEach()` and `it()`.
 *
 * Example:
 *
 * ```
 * beforeEach(inject([Dependency, AClass], (dep, object) => {
 *   // some code that uses `dep` and `object`
 *   // ...
 * }));
 *
 * it('...', inject([AClass], (object) => {
 *   object.doSomething();
 *   expect(...);
 * })
 * ```
 *
 * Notes:
 * - inject is currently a function because of some Traceur limitation the syntax should
 * eventually
 *   becomes `it('...', @Inject (object: AClass, async: AsyncTestCompleter) => { ... });`
 *
 * @param {Array} tokens
 * @param {Function} fn
 * @return {FunctionWithParamTokens}
 */
export function inject(tokens, fn) {
    return new FunctionWithParamTokens(tokens, fn, false);
}
export class InjectSetupWrapper {
    constructor(_providers) {
        this._providers = _providers;
    }
    inject(tokens, fn) {
        return new FunctionWithParamTokens(tokens, fn, false, this._providers);
    }
    injectAsync(tokens, fn) {
        return new FunctionWithParamTokens(tokens, fn, true, this._providers);
    }
}
export function withProviders(providers) {
    return new InjectSetupWrapper(providers);
}
/**
 * Allows injecting dependencies in `beforeEach()` and `it()`. The test must return
 * a promise which will resolve when all asynchronous activity is complete.
 *
 * Example:
 *
 * ```
 * it('...', injectAsync([AClass], (object) => {
 *   return object.doSomething().then(() => {
 *     expect(...);
 *   });
 * })
 * ```
 *
 * @param {Array} tokens
 * @param {Function} fn
 * @return {FunctionWithParamTokens}
 */
export function injectAsync(tokens, fn) {
    return new FunctionWithParamTokens(tokens, fn, true);
}
function emptyArray() {
    return [];
}
export class FunctionWithParamTokens {
    constructor(_tokens, _fn, isAsync, additionalProviders = emptyArray) {
        this._tokens = _tokens;
        this._fn = _fn;
        this.isAsync = isAsync;
        this.additionalProviders = additionalProviders;
    }
    /**
     * Returns the value of the executed function.
     */
    execute(injector) {
        var params = this._tokens.map(t => injector.get(t));
        return FunctionWrapper.apply(this._fn, params);
    }
    hasToken(token) { return this._tokens.indexOf(token) > -1; }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9pbmplY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFuZ3VsYXIyL3NyYy90ZXN0aW5nL3Rlc3RfaW5qZWN0b3IudHMiXSwibmFtZXMiOlsiVGVzdEluamVjdG9yIiwiVGVzdEluamVjdG9yLmNvbnN0cnVjdG9yIiwiVGVzdEluamVjdG9yLnJlc2V0IiwiVGVzdEluamVjdG9yLmFkZFByb3ZpZGVycyIsIlRlc3RJbmplY3Rvci5jcmVhdGVJbmplY3RvciIsIlRlc3RJbmplY3Rvci5leGVjdXRlIiwiZ2V0VGVzdEluamVjdG9yIiwic2V0QmFzZVRlc3RQcm92aWRlcnMiLCJyZXNldEJhc2VUZXN0UHJvdmlkZXJzIiwiaW5qZWN0IiwiSW5qZWN0U2V0dXBXcmFwcGVyIiwiSW5qZWN0U2V0dXBXcmFwcGVyLmNvbnN0cnVjdG9yIiwiSW5qZWN0U2V0dXBXcmFwcGVyLmluamVjdCIsIkluamVjdFNldHVwV3JhcHBlci5pbmplY3RBc3luYyIsIndpdGhQcm92aWRlcnMiLCJpbmplY3RBc3luYyIsImVtcHR5QXJyYXkiLCJGdW5jdGlvbldpdGhQYXJhbVRva2VucyIsIkZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zLmNvbnN0cnVjdG9yIiwiRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMuZXhlY3V0ZSIsIkZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zLmhhc1Rva2VuIl0sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLFFBQVEsRUFBWSxvQkFBb0IsRUFBQyxNQUFNLGVBQWU7T0FDL0QsRUFBQyxhQUFhLEVBQW1CLE1BQU0sZ0NBQWdDO09BQ3ZFLEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0NBQWdDO09BQ25ELEVBQUMsZUFBZSxFQUFFLFNBQVMsRUFBTyxNQUFNLDBCQUEwQjtBQUV6RTtJQUFBQTtRQUNVQyxrQkFBYUEsR0FBWUEsS0FBS0EsQ0FBQ0E7UUFFL0JBLGNBQVNBLEdBQWFBLElBQUlBLENBQUNBO1FBRTNCQSxlQUFVQSxHQUFtQ0EsRUFBRUEsQ0FBQ0E7UUFR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QSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQTtJQUNqREEsQ0FBQ0E7SUFFREYsUUFBUUEsQ0FBQ0EsS0FBVUEsSUFBYUcsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFDNUVILENBQUNBO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdG9yLCBQcm92aWRlciwgUExBVEZPUk1fSU5JVElBTElaRVJ9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9uLCBFeGNlcHRpb25IYW5kbGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtMaXN0V3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7RnVuY3Rpb25XcmFwcGVyLCBpc1ByZXNlbnQsIFR5cGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbmV4cG9ydCBjbGFzcyBUZXN0SW5qZWN0b3Ige1xuICBwcml2YXRlIF9pbnN0YW50aWF0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IgPSBudWxsO1xuXG4gIHByaXZhdGUgX3Byb3ZpZGVyczogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+ID0gW107XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5faW5qZWN0b3IgPSBudWxsO1xuICAgIHRoaXMuX3Byb3ZpZGVycyA9IFtdO1xuICAgIHRoaXMuX2luc3RhbnRpYXRlZCA9IGZhbHNlO1xuICB9XG5cbiAgcGxhdGZvcm1Qcm92aWRlcnM6IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPiA9IFtdO1xuXG4gIGFwcGxpY2F0aW9uUHJvdmlkZXJzOiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4gPSBbXTtcblxuICBhZGRQcm92aWRlcnMocHJvdmlkZXJzOiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4pIHtcbiAgICBpZiAodGhpcy5faW5zdGFudGlhdGVkKSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbignQ2Fubm90IGFkZCBwcm92aWRlcnMgYWZ0ZXIgdGVzdCBpbmplY3RvciBpcyBpbnN0YW50aWF0ZWQnKTtcbiAgICB9XG4gICAgdGhpcy5fcHJvdmlkZXJzID0gTGlzdFdyYXBwZXIuY29uY2F0KHRoaXMuX3Byb3ZpZGVycywgcHJvdmlkZXJzKTtcbiAgfVxuXG4gIGNyZWF0ZUluamVjdG9yKCkge1xuICAgIHZhciByb290SW5qZWN0b3IgPSBJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlKHRoaXMucGxhdGZvcm1Qcm92aWRlcnMpO1xuICAgIHRoaXMuX2luamVjdG9yID0gcm9vdEluamVjdG9yLnJlc29sdmVBbmRDcmVhdGVDaGlsZChcbiAgICAgICAgTGlzdFdyYXBwZXIuY29uY2F0KHRoaXMuYXBwbGljYXRpb25Qcm92aWRlcnMsIHRoaXMuX3Byb3ZpZGVycykpO1xuICAgIHRoaXMuX2luc3RhbnRpYXRlZCA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXMuX2luamVjdG9yO1xuICB9XG5cbiAgZXhlY3V0ZShmbjogRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMpOiBhbnkge1xuICAgIHZhciBhZGRpdGlvbmFsUHJvdmlkZXJzID0gZm4uYWRkaXRpb25hbFByb3ZpZGVycygpO1xuICAgIGlmIChhZGRpdGlvbmFsUHJvdmlkZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuYWRkUHJvdmlkZXJzKGFkZGl0aW9uYWxQcm92aWRlcnMpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2luc3RhbnRpYXRlZCkge1xuICAgICAgdGhpcy5jcmVhdGVJbmplY3RvcigpO1xuICAgIH1cbiAgICByZXR1cm4gZm4uZXhlY3V0ZSh0aGlzLl9pbmplY3Rvcik7XG4gIH1cbn1cblxudmFyIF90ZXN0SW5qZWN0b3I6IFRlc3RJbmplY3RvciA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUZXN0SW5qZWN0b3IoKSB7XG4gIGlmIChfdGVzdEluamVjdG9yID09IG51bGwpIHtcbiAgICBfdGVzdEluamVjdG9yID0gbmV3IFRlc3RJbmplY3RvcigpO1xuICB9XG4gIHJldHVybiBfdGVzdEluamVjdG9yO1xufVxuXG4vKipcbiAqIFNldCB0aGUgcHJvdmlkZXJzIHRoYXQgdGhlIHRlc3QgaW5qZWN0b3Igc2hvdWxkIHVzZS4gVGhlc2Ugc2hvdWxkIGJlIHByb3ZpZGVyc1xuICogY29tbW9uIHRvIGV2ZXJ5IHRlc3QgaW4gdGhlIHN1aXRlLlxuICpcbiAqIFRoaXMgbWF5IG9ubHkgYmUgY2FsbGVkIG9uY2UsIHRvIHNldCB1cCB0aGUgY29tbW9uIHByb3ZpZGVycyBmb3IgdGhlIGN1cnJlbnQgdGVzdFxuICogc3VpdGUgb24gdGVoIGN1cnJlbnQgcGxhdGZvcm0uIElmIHlvdSBhYnNvbHV0ZWx5IG5lZWQgdG8gY2hhbmdlIHRoZSBwcm92aWRlcnMsXG4gKiBmaXJzdCB1c2UgYHJlc2V0QmFzZVRlc3RQcm92aWRlcnNgLlxuICpcbiAqIFRlc3QgUHJvdmlkZXJzIGZvciBpbmRpdmlkdWFsIHBsYXRmb3JtcyBhcmUgYXZhaWxhYmxlIGZyb21cbiAqICdhbmd1bGFyMi9wbGF0Zm9ybS90ZXN0aW5nLzxwbGF0Zm9ybV9uYW1lPicuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRCYXNlVGVzdFByb3ZpZGVycyhwbGF0Zm9ybVByb3ZpZGVyczogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uUHJvdmlkZXJzOiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4pIHtcbiAgdmFyIHRlc3RJbmplY3RvciA9IGdldFRlc3RJbmplY3RvcigpO1xuICBpZiAodGVzdEluamVjdG9yLnBsYXRmb3JtUHJvdmlkZXJzLmxlbmd0aCA+IDAgfHwgdGVzdEluamVjdG9yLmFwcGxpY2F0aW9uUHJvdmlkZXJzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbignQ2Fubm90IHNldCBiYXNlIHByb3ZpZGVycyBiZWNhdXNlIGl0IGhhcyBhbHJlYWR5IGJlZW4gY2FsbGVkJyk7XG4gIH1cbiAgdGVzdEluamVjdG9yLnBsYXRmb3JtUHJvdmlkZXJzID0gcGxhdGZvcm1Qcm92aWRlcnM7XG4gIHRlc3RJbmplY3Rvci5hcHBsaWNhdGlvblByb3ZpZGVycyA9IGFwcGxpY2F0aW9uUHJvdmlkZXJzO1xuICB2YXIgaW5qZWN0b3IgPSB0ZXN0SW5qZWN0b3IuY3JlYXRlSW5qZWN0b3IoKTtcbiAgbGV0IGluaXRzOiBGdW5jdGlvbltdID0gaW5qZWN0b3IuZ2V0T3B0aW9uYWwoUExBVEZPUk1fSU5JVElBTElaRVIpO1xuICBpZiAoaXNQcmVzZW50KGluaXRzKSkge1xuICAgIGluaXRzLmZvckVhY2goaW5pdCA9PiBpbml0KCkpO1xuICB9XG4gIHRlc3RJbmplY3Rvci5yZXNldCgpO1xufVxuXG4vKipcbiAqIFJlc2V0IHRoZSBwcm92aWRlcnMgZm9yIHRoZSB0ZXN0IGluamVjdG9yLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRCYXNlVGVzdFByb3ZpZGVycygpIHtcbiAgdmFyIHRlc3RJbmplY3RvciA9IGdldFRlc3RJbmplY3RvcigpO1xuICB0ZXN0SW5qZWN0b3IucGxhdGZvcm1Qcm92aWRlcnMgPSBbXTtcbiAgdGVzdEluamVjdG9yLmFwcGxpY2F0aW9uUHJvdmlkZXJzID0gW107XG4gIHRlc3RJbmplY3Rvci5yZXNldCgpO1xufVxuXG4vKipcbiAqIEFsbG93cyBpbmplY3RpbmcgZGVwZW5kZW5jaWVzIGluIGBiZWZvcmVFYWNoKClgIGFuZCBgaXQoKWAuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBcbiAqIGJlZm9yZUVhY2goaW5qZWN0KFtEZXBlbmRlbmN5LCBBQ2xhc3NdLCAoZGVwLCBvYmplY3QpID0+IHtcbiAqICAgLy8gc29tZSBjb2RlIHRoYXQgdXNlcyBgZGVwYCBhbmQgYG9iamVjdGBcbiAqICAgLy8gLi4uXG4gKiB9KSk7XG4gKlxuICogaXQoJy4uLicsIGluamVjdChbQUNsYXNzXSwgKG9iamVjdCkgPT4ge1xuICogICBvYmplY3QuZG9Tb21ldGhpbmcoKTtcbiAqICAgZXhwZWN0KC4uLik7XG4gKiB9KVxuICogYGBgXG4gKlxuICogTm90ZXM6XG4gKiAtIGluamVjdCBpcyBjdXJyZW50bHkgYSBmdW5jdGlvbiBiZWNhdXNlIG9mIHNvbWUgVHJhY2V1ciBsaW1pdGF0aW9uIHRoZSBzeW50YXggc2hvdWxkXG4gKiBldmVudHVhbGx5XG4gKiAgIGJlY29tZXMgYGl0KCcuLi4nLCBASW5qZWN0IChvYmplY3Q6IEFDbGFzcywgYXN5bmM6IEFzeW5jVGVzdENvbXBsZXRlcikgPT4geyAuLi4gfSk7YFxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHRva2Vuc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0Z1bmN0aW9uV2l0aFBhcmFtVG9rZW5zfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0KHRva2VuczogYW55W10sIGZuOiBGdW5jdGlvbik6IEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zIHtcbiAgcmV0dXJuIG5ldyBGdW5jdGlvbldpdGhQYXJhbVRva2Vucyh0b2tlbnMsIGZuLCBmYWxzZSk7XG59XG5cbmV4cG9ydCBjbGFzcyBJbmplY3RTZXR1cFdyYXBwZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wcm92aWRlcnM6ICgpID0+IGFueSkge31cblxuICBpbmplY3QodG9rZW5zOiBhbnlbXSwgZm46IEZ1bmN0aW9uKTogRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMge1xuICAgIHJldHVybiBuZXcgRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnModG9rZW5zLCBmbiwgZmFsc2UsIHRoaXMuX3Byb3ZpZGVycyk7XG4gIH1cblxuICBpbmplY3RBc3luYyh0b2tlbnM6IGFueVtdLCBmbjogRnVuY3Rpb24pOiBGdW5jdGlvbldpdGhQYXJhbVRva2VucyB7XG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbldpdGhQYXJhbVRva2Vucyh0b2tlbnMsIGZuLCB0cnVlLCB0aGlzLl9wcm92aWRlcnMpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3aXRoUHJvdmlkZXJzKHByb3ZpZGVyczogKCkgPT4gYW55KSB7XG4gIHJldHVybiBuZXcgSW5qZWN0U2V0dXBXcmFwcGVyKHByb3ZpZGVycyk7XG59XG5cbi8qKlxuICogQWxsb3dzIGluamVjdGluZyBkZXBlbmRlbmNpZXMgaW4gYGJlZm9yZUVhY2goKWAgYW5kIGBpdCgpYC4gVGhlIHRlc3QgbXVzdCByZXR1cm5cbiAqIGEgcHJvbWlzZSB3aGljaCB3aWxsIHJlc29sdmUgd2hlbiBhbGwgYXN5bmNocm9ub3VzIGFjdGl2aXR5IGlzIGNvbXBsZXRlLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBgXG4gKiBpdCgnLi4uJywgaW5qZWN0QXN5bmMoW0FDbGFzc10sIChvYmplY3QpID0+IHtcbiAqICAgcmV0dXJuIG9iamVjdC5kb1NvbWV0aGluZygpLnRoZW4oKCkgPT4ge1xuICogICAgIGV4cGVjdCguLi4pO1xuICogICB9KTtcbiAqIH0pXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSB0b2tlbnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbldpdGhQYXJhbVRva2Vuc31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluamVjdEFzeW5jKHRva2VuczogYW55W10sIGZuOiBGdW5jdGlvbik6IEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zIHtcbiAgcmV0dXJuIG5ldyBGdW5jdGlvbldpdGhQYXJhbVRva2Vucyh0b2tlbnMsIGZuLCB0cnVlKTtcbn1cblxuZnVuY3Rpb24gZW1wdHlBcnJheSgpOiBBcnJheTxhbnk+IHtcbiAgcmV0dXJuIFtdO1xufVxuXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF90b2tlbnM6IGFueVtdLCBwcml2YXRlIF9mbjogRnVuY3Rpb24sIHB1YmxpYyBpc0FzeW5jOiBib29sZWFuLFxuICAgICAgICAgICAgICBwdWJsaWMgYWRkaXRpb25hbFByb3ZpZGVyczogKCkgPT4gYW55ID0gZW1wdHlBcnJheSkge31cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdmFsdWUgb2YgdGhlIGV4ZWN1dGVkIGZ1bmN0aW9uLlxuICAgKi9cbiAgZXhlY3V0ZShpbmplY3RvcjogSW5qZWN0b3IpOiBhbnkge1xuICAgIHZhciBwYXJhbXMgPSB0aGlzLl90b2tlbnMubWFwKHQgPT4gaW5qZWN0b3IuZ2V0KHQpKTtcbiAgICByZXR1cm4gRnVuY3Rpb25XcmFwcGVyLmFwcGx5KHRoaXMuX2ZuLCBwYXJhbXMpO1xuICB9XG5cbiAgaGFzVG9rZW4odG9rZW46IGFueSk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fdG9rZW5zLmluZGV4T2YodG9rZW4pID4gLTE7IH1cbn1cbiJdfQ==