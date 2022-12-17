import Icon from '@elements/Icon'
import { useEffect } from 'react'
import css from 'styled-jsx/css'

const styles = css`
  div {
    border: solid 2px var(--h5-font-color);
    border-radius: 4px;
    padding: 1.8rem;
    display: inline-flex;
    flex-direction: column;
    align-items: stretch;
    margin: 1.2rem;
    flex: 1;
    min-width: 40rem;
    text-align: left;
  }
  div h5 {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
  }
  div h5 :global(.icon) {
    margin-right: 1.2rem;
  }
  div * {
    font-weight: normal;
  }
  pre span {
    font: inherit;
  }
`

function EmailCard({ settings, update }) {
  const regexMatched = settings.usePattern && (new RegExp(settings.pattern)).test(settings.humanId)

  useEffect(() => {
    const validPattern = !settings.usePattern || regexMatched
    const addError = !validPattern && !settings.error
    const delError = validPattern && settings.error
    if (addError || delError) {
      update({
        ...settings,
        error: addError ? 'invalid pattern match' : undefined
      })
    }
  }, [settings])

  return (
    <div>
      <style jsx>{styles}</style>
      <h5><Icon id="Mail" size={24} /> Email</h5>
      <label>
        <input
          type="checkbox"
          checked={settings.include}
          onChange={e => {
            update({
              ...settings,
              include: e.target.checked,
              usePattern: e.target.checked ? settings.usePattern : false,
              pattern: e.target.checked ? settings.pattern : '',
              categorize: e.target.checked ? settings.categorize : false,
            })
          }}
        />
        include {settings.humanId}
      </label>
      {settings.include && (
        <label>
          <input
            type="checkbox"
            checked={settings.usePattern}
            onChange={e => {
              update({
                ...settings,
                usePattern: e.target.checked
              })
            }}
          />
          assert pattern only
        </label>
      )}
      {settings.usePattern && <>
        <label>regex pattern</label>
        <input
          placeholder={`@${settings.humanId.split('@')[1]}`}
          value={settings.pattern}
          onChange={e => {
            update({
              ...settings,
              pattern: e.target.value
            })
          }}
        />
      </>}
      {settings.include && (
        <label>
          <input
            type="checkbox"
            checked={settings.categorize}
            onChange={e => {
              update({
                ...settings,
                categorize: e.target.checked
              })
            }}
          />
          match against categories
        </label>
      )}
    </div>
  )
}

function DomainCard({ settings, update }) {
  return (
    <div>
      <style jsx>{styles}</style>
      <h5><Icon id="Www" size={24} /> Domain</h5>
      <label>
        <input
          type="checkbox"
          checked={settings.include}
          onChange={e => {
            update({
              ...settings,
              include: e.target.checked,
            })
          }}
        />
        include {settings.humanId}
      </label>
    </div>
  )
}

function GitHubCard({ settings, update }) {
  return (
    <div>
      <style jsx>{styles}</style>
      <h5><Icon id="GitHub" size={24} /> GitHub</h5>
      <label>
        <input
          type="checkbox"
          checked={settings.include}
          onChange={e => {
            update({
              ...settings,
              include: e.target.checked,
              show_handle: e.target.checked ? settings.show_handle : false,
              public_repos: e.target.checked ? settings.public_repos : false,
              public_gists: e.target.checked ? settings.public_gists : false,
              followers: e.target.checked ? settings.followers : false,
              contributions: e.target.checked ? settings.contributions : false,
            })
          }}
        />
        include {settings.humanId}
      </label>
      {settings.include && (
        <>
          <label>
            <input
              type="checkbox"
              checked={settings.show_handle}
              onChange={e => {
                update({
                  ...settings,
                  show_handle: e.target.checked,
                })
              }}
            />
            show handle
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.public_repos}
              onChange={e => {
                update({
                  ...settings,
                  public_repos: e.target.checked,
                })
              }}
            />
            include public repo count
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.public_gists}
              onChange={e => {
                update({
                  ...settings,
                  public_gists: e.target.checked,
                })
              }}
            />
            include public gists count
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.followers}
              onChange={e => {
                update({
                  ...settings,
                  followers: e.target.checked,
                })
              }}
            />
            include followers count
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.contributions}
              onChange={e => {
                update({
                  ...settings,
                  contributions: e.target.checked,
                })
              }}
            />
            include contributions count
          </label>
        </>
      )}
    </div>
  )
}

function TwitterCard({ settings, update }) {
  return (
    <div>
      <style jsx>{styles}</style>
      <h5><Icon id="Twitter" size={24} /> Twitter</h5>
      <label>
        <input
          type="checkbox"
          checked={settings.include}
          onChange={e => {
            update({
              ...settings,
              include: e.target.checked,
              show_handle: e.target.checked ? settings.show_handle : false,
              followers: e.target.checked ? settings.followers : false,
              tweets: e.target.checked ? settings.tweets : false,
            })
          }}
        />
        include {settings.humanId}
      </label>
      {settings.include && (
        <>
          <label>
            <input
              type="checkbox"
              checked={settings.show_handle}
              onChange={e => {
                update({
                  ...settings,
                  show_handle: e.target.checked,
                })
              }}
            />
            show handle
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.followers}
              onChange={e => {
                update({
                  ...settings,
                  followers: e.target.checked,
                })
              }}
            />
            include followers count
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.tweets}
              onChange={e => {
                update({
                  ...settings,
                  tweets: e.target.checked,
                })
              }}
            />
            include tweet count
          </label>
        </>
      )}
    </div>
  )
}

function MediumCard({ settings, update }) {
  return (
    <div>
      <style jsx>{styles}</style>
      <h5><Icon id="Medium" size={24} /> Medium</h5>
      <label>
        <input
          type="checkbox"
          checked={settings.include}
          onChange={e => {
            update({
              ...settings,
              include: e.target.checked,
              show_handle: e.target.checked ? settings.show_handle : false,
              followers: e.target.checked ? settings.followers : false,
            })
          }}
        />
        include {settings.humanId}
      </label>
      {settings.include && (
        <>
          <label>
            <input
              type="checkbox"
              checked={settings.show_handle}
              onChange={e => {
                update({
                  ...settings,
                  show_handle: e.target.checked,
                })
              }}
            />
            show handle
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.followers}
              onChange={e => {
                update({
                  ...settings,
                  followers: e.target.checked,
                })
              }}
            />
            include followers count
          </label>
        </>
      )}
    </div>
  )
}


export default {
  email: EmailCard,
  domain: DomainCard,
  github: GitHubCard,
  twitter: TwitterCard,
  medium: MediumCard,
}

