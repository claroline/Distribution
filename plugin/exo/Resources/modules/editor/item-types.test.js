import assert from 'assert'
import {assertEqual} from './test-utils'
import {
  registerItemType,
  listItemMimeTypes,
  getDefinition,
  getDecorators,
  resetTypes
} from './item-types'

describe('Registering an item type', () => {
  afterEach(resetTypes)

  it('throws if item name type is absent or invalid', () => {
    assert.throws(() => {
      registerItemType({})
    }, /name is mandatory/)
    assert.throws(() => {
      registerItemType({name: []})
    }, /name must be a string/i)
  })

  it('throws if item mime type is absent or invalid', () => {
    assert.throws(() => {
      registerItemType({name: 'foo'})
    }, /mime type is mandatory/)
    assert.throws(() => {
      registerItemType({name: 'foo', type: []})
    }, /mime type must be a string/i)
  })

  it('throws if item component is absent', () => {
    assert.throws(() => {
      registerItemType({name: 'foo', type: 'foo/bar'})
    }, /component is mandatory/i)
  })

  it('throws if item reducer is absent or invalid', () => {
    assert.throws(() => {
      registerItemType({
        name: 'foo',
        type: 'foo/bar',
        component: () => {}
      })
    }, /reduce is mandatory/i)
    assert.throws(() => {
      registerItemType({
        name: 'foo',
        type: 'foo/bar',
        component: () => {},
        reduce: 'bar'
      })
    }, /reduce must be a function/i)

    it('throws if decorate is not a function', () => {
      assert.throws(() => {
        registerItemType({
          name: 'foo',
          type: 'foo/bar',
          component: () => {},
          reduce: () => {},
          decorate: false
        })
      }, /decorate must be a function/i)
    })

    it('throws if validate is not a function', () => {
      assert.throws(() => {
        registerItemType({
          name: 'foo',
          type: 'foo/bar',
          component: () => {},
          reduce: () => {},
          validate: false
        })
      }, /validate must be a function/i)
    })
  })

  it('registers valid types as expected', () => {
    registerItemType(validDefinitionFixture())
    assertEqual(listItemMimeTypes(), ['foo/bar'])
    const def = getDefinition('foo/bar')
    assertEqual(def.name, 'foo')
    assertEqual(def.type, 'foo/bar')
    assertEqual(def.component(), 'component')
    assertEqual(def.reduce('item'), 'item')
  })

  it('throws if item type is already registered', () => {
    registerItemType(validDefinitionFixture())
    assert.throws(() => {
      registerItemType(validDefinitionFixture())
    }, /already registered/i)
  })

  it('defaults items to questions', () => {
    registerItemType(validDefinitionFixture())
    assertEqual(getDefinition('foo/bar').question, true)
  })

  it('defaults decorators to identity functions', () => {
    registerItemType(validDefinitionFixture())
    assertEqual(getDefinition('foo/bar').decorate('item'), 'item')
  })

  it('defaults validators to noop functions', () => {
    registerItemType(validDefinitionFixture())
    assertEqual(getDefinition('foo/bar').validate('item'), {})
  })

  it('throws if definition contains extra properties', () => {
    const definition = Object.assign({}, validDefinitionFixture(), {bar: 'baz'})
    assert.throws(() => {
      registerItemType(definition)
    }, /unknown property 'bar' in 'foo' definition/i)
  })
})

describe('Getting a type definition', () => {
  afterEach(resetTypes)

  it('throws if type does not exist', () => {
    assert.throws(() => {
      getDefinition('unknown/type')
    }, /unknown item type/i)
  })

  it('returns the full definition', () => {
    registerItemType(validDefinitionFixture())
    const def = getDefinition('foo/bar')
    assertEqual(def.type, 'foo/bar')
    assertEqual(def.component(), 'component')
    assertEqual(def.reduce('item'), 'item')
    assertEqual(def.decorate('item'), 'item')
    assertEqual(def.validate('item'), {})
  })
})

describe('Getting type decorates', () => {
  afterEach(resetTypes)

  it('sorts decorators by type', () => {
    registerItemType(validDefinitionFixture())
    const decorators = getDecorators()
    assertEqual(Object.keys(decorators), ['foo/bar'])
    assertEqual(typeof decorators['foo/bar'], 'function')
  })
})

function validDefinitionFixture() {
  return {
    name: 'foo',
    type: 'foo/bar',
    component: () => 'component',
    reduce: item => item
  }
}
