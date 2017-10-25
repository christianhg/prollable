import test from 'ava'

import { fromCondition, fromNullable } from './index'

const id = x => x

test('fromCondition', async t => {
  t.is(await fromCondition(false, 'candy', 'mud').catch(id), 'mud')
  t.is(await fromCondition(true, 'candy', 'mud'), 'candy')
})

test('fromNullable', async t => {
  const obj = { a: 1 }

  t.is(await fromNullable(obj.b, 'nob').catch(id), 'nob')
  t.is(await fromNullable(obj.a, 'noa'), 1)
})
