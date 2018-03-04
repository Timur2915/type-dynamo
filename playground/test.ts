import { isLessOrEqualTo, match, size } from '../src/schema/chaining/expressions'
import User from './User'

async function test() {
    const users = await User.scan().paginate(100, { id: '10', age: 20})
}

test()
