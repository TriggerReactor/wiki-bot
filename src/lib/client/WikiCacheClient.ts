/* eslint-disable @typescript-eslint/no-magic-numbers */

import { container } from '@sapphire/pieces'
import { Option, Result } from '@sapphire/result'
import { envParseNumber, envParseString } from '@skyra/env-utilities'
import { jaroWinkler } from '@skyra/jaro-winkler'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { RootDirectory, EnvironmentKeys } from '#lib/utils/constants.js'

interface ConsumeRange {
  offset?: number
  take?: number
}

interface GetDocumentsOptions extends ConsumeRange {
  cache?: boolean
  exclude?: string[]
}

type FuzzilySearchDocsOptions = ConsumeRange

interface FuzzilySearchDocsResult {
  name: string
}

export class WikiCacheClient {
  private static readonly defaultExcludeFiles = [`.git`, `_Sidebar.md`]

  readonly #loadedDocs: string[]

  public constructor() {
    container.wikiCacheClient = this

    this.#loadedDocs = []

    this.initDocs().then(async isOk => {
      if (isOk) {
        await this.getDocs({ cache: false })
      }
    })
  }

  private get absoluteDataDir(): string {
    return envParseString(EnvironmentKeys.DATA_DIR)
  }

  private get baseUrl(): string {
    return envParseString(EnvironmentKeys.BASE_URL)
  }

  private get fuzzilyDocsSearchThreshold(): number {
    return envParseNumber(EnvironmentKeys.FUZZILY_DOCS_SEARCH_THRESHOLD)
  }

  private get relativeDataDir(): string {
    return join(fileURLToPath(RootDirectory), this.absoluteDataDir)
  }

  private get targetGitToSync(): string {
    return envParseString(EnvironmentKeys.TARGET_GIT_TO_SYNC)
  }

  private static defaultExcludeFileFilter(filename: string): boolean {
    return !WikiCacheClient.defaultExcludeFiles.includes(filename)
  }

  public async fetchDocs(): Promise<string[]> {
    const temp = [...this.#loadedDocs]

    this.#loadedDocs.length = 0

    const result = await this.readDataDir()

    if (result.isErr()) {
      this.#loadedDocs.push(...temp)
    } else {
      const docs = result
        .unwrap()
        .filter(WikiCacheClient.defaultExcludeFileFilter)
        .map(docs => docs.replace(/\.md$/, ``))

      this.#loadedDocs.push(...docs)
    }

    return [...this.#loadedDocs]
  }

  public async fuzzilySearchDocs(docs: string): Promise<FuzzilySearchDocsResult[]>
  public async fuzzilySearchDocs(
    query: string,
    options: FuzzilySearchDocsOptions = { offset: 0, take: 20 }
  ): Promise<FuzzilySearchDocsResult[]> {
    const { offset = 0, take = 20 } = options

    const docs = await this.getDocs()

    interface SimilarityResult {
      name: string
      similarity: number
    }

    const result: FuzzilySearchDocsResult[] = []
    const similarityResults: SimilarityResult[] = []

    for (const document of docs) {
      const similarity = query === document ? 1 : jaroWinkler(document, query)

      if (similarity < this.fuzzilyDocsSearchThreshold) {
        continue
      }

      similarityResults.push({
        name: document,
        similarity
      })
    }

    if (similarityResults.length > 0) {
      similarityResults
        .sort(({ similarity: a }, { similarity: b }) => b - a)
        .slice(offset, offset + take)
        .forEach(({ name }) => {
          result.push({ name })
        })
    }

    return result
  }

  public async getDocs(
    options: GetDocumentsOptions = { cache: true, exclude: [] }
  ): Promise<string[]> {
    const docs = []
    const exclude = options.exclude ?? []
    const excludeFilter = (docs: string): boolean => !exclude.includes(docs)
    const { offset = 0, take = 25 } = options

    const isCache = options.cache ?? true

    if (isCache) {
      docs.push(...this.#loadedDocs)
    } else {
      const loadedDocs = await this.fetchDocs()

      docs.push(...loadedDocs)
    }

    return docs.filter(excludeFilter).slice(offset, take)
  }

  public async getDocumentLink(document: string): Promise<Option<string>> {
    const docs = await this.getDocs()

    return Option.from(() => docs.find(doc => doc === document)).map(doc => this.baseUrl + doc)
  }

  public async initDocs(): Promise<boolean> {
    const IOReadResult = await this.readDataDir() // eslint-disable-line @typescript-eslint/naming-convention

    if (IOReadResult.isOk()) {
      return true
    }

    const { targetGitToSync, absoluteDataDir } = this

    const operationResult = await $`git clone ${targetGitToSync} ${absoluteDataDir}`

    return operationResult.exitCode === 0
  }

  public async updateDocs(): Promise<boolean> {
    if (this.#loadedDocs.length !== 0) {
      return await within(async () => {
        cd(this.relativeDataDir)
        const operationResult = await $`git pull --rebase`

        return operationResult.exitCode === 0
      })
    } else {
      return await this.initDocs()
        .then(async () => {
          const fetched = await this.fetchDocs()

          return fetched.length > 0
        })
        .catch(() => false)
    }
  }

  private async readDataDir(): Promise<Result<string[], Error>> {
    return await Result.fromAsync(async () => readdir(this.relativeDataDir))
  }
}

export namespace WikiCacheClient {
  export namespace GetDocuments {
    export type Options = GetDocumentsOptions
  }

  export namespace FuzzilySearchDocs {
    export type Options = FuzzilySearchDocsOptions
    export type Result = FuzzilySearchDocsResult
  }
}
