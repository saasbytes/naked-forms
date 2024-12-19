/**
 * Form
 */
export interface FormDefinition extends Versioned {
	/**
	 * Form ID
	 */
	id: string

	/**
	 * Form name
	 */
	// TODO: displayName?
	name: string

	/**
	 * Form's slug, which is a unique identifier for the form at the API level
	 * By default it falls back to the form name, but can be set to a custom value, with some restrictions
	 * - must be unique across all forms
	 * - must be a valid UTF8 URL path segment with the following limitations: only letters, numbers and hyphens, underscores, and periods are allowed
	 */
	// fixed after the form is first ever published
	slug: string

	status: FormDefinitionStatus

	// TODO: should the context be part of the form or part of the response?
	// /**
	//  * Form context, optional
	//  */
	// context?: FormContext

	metadata: {
		publishedAt: number
	}

	createdAt: number
	updatedAt: number
}

type FormDefinitionStatus = 'draft' | 'published' // does this make sense? should we use publishedAt instead?

export type ActiveForm = Omit<FormDefinition, 'commit' | 'status' | 'metadata' | 'createdAt' | 'updatedAt'>

/**
 * Form Context
 */
export type FormContext = {}

type FormResponseEntry = {
	id: string
}

type FormStep = {
	id: string
	slug: string
	type: 'question' | 'custom'

	section?: string
	title: string
	subtitle?: string
	description?: string

	actions: FormAction[]
} & ({
	type: 'question'
	questions: FormQuestion[]
} | { type: 'custom' })

type FormQuestion = StandardFormQuestion | CustomFormQuestion

type FormQuestionBase = {
	id: string
	// generic config object, applicable for all question types
	config: {
		isRequired: boolean
	}
}

type CustomFormQuestion = FormQuestionBase & {
	isCustom: true
	name: string
}

type StandardFormQuestion = FormQuestionBase & {
	isCustom: false
	type: FormQuestionType
}

type FormQuestionType = 'multi_select_checkbox' | 'single_select_dropdown' | 'single_select_list' | 'boolean_checkbox' | 'date' | FormDisplayOnlyQuestionType
type FormDisplayOnlyQuestionType = 'display_text' | 'modal'

type FormAction = FormActionNext | FormActionPrevious | FormActionLink

type FormActionNext = {
	type: 'next'
	next: { label: string }
}

type FormActionPrevious = {
	type: 'previous'
	previous: { label: string }
}

type FormActionLink = {
	type: 'link'
	link: { label: string, url: string }
}

// git hashing https://gist.github.com/masak/2415865

/*
- create new form definition => name=sign-up/branch=production/version=v0.0.0/status=draft/commit=00000000001
- make in browser updates
	- they are stored in the browser and show indicator that you have local changes (*)
???////////// should we save intermediary checkpoints (at X minutes intervals??) to the server? if yes, what about the commit hash?
- (whenever manual|auto) save draft => save the form definition to the server / includes audit trail
	- if no commit hash, then generate one (include the parent commit hash in the new commit hash)
	- then the response comes back, also include the new commit hash of the parent branch
	- check it the current parent commit hash corresponds to the one in the response
- save draft and publish => show a diff for checking what has been changed => save the form definition to the server / includes audit trail + bump the version according to the changes
	- also generate a new commit hash
=> name=sign-up/branch=production/version=v1.0.0/status=published/commit=00000000002
- make some minor changes to a text field => save and publish
	- bump the version according to the changes
	- update the commit hash
=> name=sign-up/branch=production/version=v1.0.1/status=published/commit=00000000003
??? how do you actually roll back, verify history of what changed when?
??? instead of computing diffs from the history, maybe store all published versions of the form definition but always mark as stale the ones that are not the latest?
 */

/* possible DB entries examples evolution
=> draft to published
name=sign-up/branch=production/version=v0.0.0/status=draft/commit=00000000001
name=sign-up/branch=production/version=v0.0.0/status=draft/commit=00000000002
name=sign-up/branch=production/version=v1.0.0/status=published/commit=00000000003 // if save and publish with changes. if no changes, just publish, commit would have been 00000000002
name=sign-up/branch=production/version=v1.0.1/status=published/commit=00000000004 // save and publish with changes and no changes in the BD (aka commit) from the previous published version

going further, you cannot save only a published version, you have to branch off from it to keep your changes persisted

=> branch off from a published version
=> this implies that forms can also be accessed by their branch name? or commit hash? or both (aka either of them?)
=> should this have a version?
name=sign-up/branch=fox-test/version=v1.0.1/status=published/parent=production_00000000004/commit=00000000005
name=sign-up/branch=fox-test-2/version=v1.0.1/status=published/parent=fox-test_00000000005/commit=00000000006
after saving changes => name=sign-up/branch=fox-test-2/version=v2.0.0/status=published/parent=fox-test_00000000005/commit=00000000007


name=sign-up/branch=production/version=v0.0.0/status=draft/commit=00000000001
??? how to represent a WIP form changeset? what if 2 users
 */

// maybe responses should have an isLiveMode flag that indicates if the form is in live mode or not???

interface Versioned {
	version: `v${number}.${number}.${number}`
	// how to group these 2?
	branch: string
	commit: string
}
