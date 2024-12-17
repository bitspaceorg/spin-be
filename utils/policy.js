import { GRPC as Cerbos } from "@cerbos/grpc";
import Env from "../config.js";
const cerbos = new Cerbos(Env.CERBROS_URL);

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} role
 * */

/**
 * @param {string} resource
 * @param {string} action
 * @param {User} user
 * @returns {Promise<boolean>} returns true if the policy is allowed
 * */
async function checkPolicy(resource, action, user) {
  try {
    const decision = await cerbos.checkResource({
      principal: {
        id: user.id,
        role: user.role,
      },
      actions: [action],
    });
    return decision.isAllowed(action);
  } catch (err) {
    return false;
  }
}
