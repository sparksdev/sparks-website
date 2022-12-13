export default async function (entries) {
  /**
   * meta property="profile:username"
   * meta property="profile:first_name"
   * meta property="profile:last_name"
   * .pw-follower-count a (followers)
   * .pw-follower-count button (following)
   */

  return { service: 'twitter', data: entries }
}
