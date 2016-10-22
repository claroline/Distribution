import assert from 'assert'
import {assertEqual} from './test-utils'
import {
  registerItemType,
  listItemMimeTypes,
  getDefinition,
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
    }, /reducer is mandatory/i)
    assert.throws(() => {
      registerItemType({
        name: 'foo',
        type: 'foo/bar',
        component: () => {},
        reducer: 'bar'
      })
    }, /reducer must be a function/i)
  })

  it('registers valid types as expected', () => {
    registerItemType(validDefinitionFixture())
    assertEqual(listItemMimeTypes(), ['foo/bar'])
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

  it('defaults augmenters to identity functions', () => {
    registerItemType(validDefinitionFixture())
    assertEqual(typeof getDefinition('foo/bar').augmenter, 'function')
  })
})

describe('Getting a type definition', () => {
  it('throws if type does not exist', () => {
    assert.throws(() => {
      getDefinition('unknown/type')
    }, /unknown item type/i)
  })

  it('returns the full definition', () => {
    registerItemType(validDefinitionFixture())
    const def = getDefinition('foo/bar')
    assertEqual(def.type, 'foo/bar')
    assertEqual(typeof def.component, 'function')
    assertEqual(typeof def.reducer, 'function')
    assertEqual(typeof def.augmenter, 'function')
  })
})

function validDefinitionFixture() {
  return {
    name: 'foo',
    type: 'foo/bar',
    component: () => {},
    reducer: () => {}
  }
}
