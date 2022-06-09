import { Directive } from "@angular/core";

@Directive()
export abstract class EventEmitter {
  callbacks: any;
  constructor() {
    this.callbacks = {};
    this.callbacks.base = {};
  }

  on(_names: string, callback: () => void): void {

    // Resolve names
    const names = this.resolveNames(_names);

    // Each name
    names.forEach((_name: string) => {
      // Resolve name
      const name = this.resolveName(_name);

      // Create namespace if not exist
      if ((this.callbacks[name.namespace] instanceof Object)) {
        this.callbacks[name.namespace] = {}
      }

      // Create callback if not exist
      if (!(this.callbacks[name.namespace][name.value] instanceof Array)) {
        this.callbacks[name.namespace][name.value] = []
      }

      // Add callback
      this.callbacks[name.namespace][name.value].push(callback);
      return this
    })
  }

  public off(_names: string) {
    // Resolve names
    const names = this.resolveNames(_names);

    // Each name
    names.forEach((_name: string) => {
      // Resolve name
      const name = this.resolveName(_name);

      // Remove namespace
      if (name.namespace !== 'base' && name.value === '') {
        delete this.callbacks[name.namespace]
      }

      // Remove specific callback in namespace
      else {
        // Default
        if (name.namespace === 'base') {
          // Try to remove each namespace
          for (const namespace in this.callbacks) {
            if (this.callbacks[namespace] instanceof Object && this.callbacks[namespace][name.value] instanceof Array) {
              delete this.callbacks[namespace][name.value];

              // Remove namespace if empty
              if (Object.keys(this.callbacks[namespace]).length === 0) {
                delete this.callbacks[namespace]
              }
            }
          }
        }

        // Specified namespace
        else if (this.callbacks[name.namespace] instanceof Object && this.callbacks[name.namespace][name.value] instanceof Array) {
          delete this.callbacks[name.namespace][name.value];

          // Remove namespace if empty
          if (Object.keys(this.callbacks[name.namespace]).length === 0) {
            delete this.callbacks[name.namespace];
          }
        }
      }
    });
    return this
  }

  trigger(_name: string, _args?: any) {

    let finalResult: any;
    let result = null;

    // Default args
    const args = !(_args instanceof Array) ? [] : _args;

    // Resolve names (should have one event)
    let name = this.resolveNames(_name);

    // Resolve name 
    let aname = this.resolveName(name[0]);

    // Default namespace
    if (aname.namespace === 'base') {
      // Try to find callback in each namespace
      for (const namespace in this.callbacks) {
        if (this.callbacks[namespace] instanceof Object && this.callbacks[namespace][aname.value] instanceof Array) {
          this.callbacks[namespace][aname.value].forEach((callback: any) => {
            result = callback.apply(this, args)

            if (typeof finalResult === undefined) {
              finalResult = result
            }
          })
        }
      }
    }
    // Specified namespace
    else if (this.callbacks[aname.namespace] instanceof Object) {
      if (aname.value === '') {
        console.warn('wrong name')
        return this
      }

      this.callbacks[aname.namespace][aname.value].forEach((callback: any) => {
        result = callback.apply(this, args)

        if (typeof finalResult === 'undefined')
          finalResult = result
      })
    }
    return finalResult

  }


  private resolveNames(_names: string) {
    let names = _names;
    names = names.replace(/[^a-zA-Z0-9 ,/.]/g, '');
    names = names.replace(/[,/]+/g, ' ');
    return names.split(' ');
  }

  private resolveName(name: string) {
    const parts = name.split('.');
    let newName = {
      original: name,
      value: parts[0],
      namespace: (parts.length > 1 && parts[1] !== '') ? parts[1] : 'base'
    }
    return newName
  }
}