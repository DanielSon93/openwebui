<script lang="ts">
	import { createEventDispatcher, getContext } from 'svelte';
	import { WEBUI_API_BASE_URL } from '$lib/constants';
	const dispatch = createEventDispatcher();
	const i18n = getContext('i18n');

	import XMark from '$lib/components/icons/XMark.svelte';
	import AdvancedParams from '../Settings/Advanced/AdvancedParams.svelte';
	import Valves from '$lib/components/chat/Controls/Valves.svelte';
	import FileItem from '$lib/components/common/FileItem.svelte';
	import Collapsible from '$lib/components/common/Collapsible.svelte';
	import Search from '$lib/components/icons/Search.svelte';
	import { user } from '$lib/stores';
	import { onMount } from 'svelte';
	import { EditorView, basicSetup } from 'codemirror';
	import { json } from '@codemirror/lang-json';
	import { toast } from 'svelte-sonner';

	export let models = [];
	export let chatFiles = [];
	export let params = {};

	let showValves = false;

	/**
	 * ############ 추가 시작 ############
	 */

	// Client 변수
	const clientInfo = {
		host: '',
		port: '',
		id: '',
		password: '',
		isValid: false,
		errorMessage: ''
	};

	// Index 변수
	const indexInfo = {
		selectedIndex: 'Select Index',
		searchIndexValue: '',
		originalIndices: Array.from({ length: 10 }, (_, i) => `index${i}`),
		filteredIndices: [],
		isOpen: false,
		isIndexSelected: false,
		errorMessage: ''
	};
	indexInfo.filteredIndices = [...indexInfo.originalIndices];

	// Query 변수
	const queryInfo = {
		query: `{}`,
		errorMessage: ''
	};
	let editorContainer;

	// Client 유효성 검사
	const validateClientInfo = (info) => {
		const { host, port, id, password } = info;
		const isHostValid =
			/^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(
				host.trim()
			);
		const portNum = Number(port.trim());
		const isPortValid = !isNaN(portNum) && portNum >= 1 && portNum <= 65535;
		const isIdValid = id.trim().length > 0;
		const isPasswordValid = password.trim().length > 0;

		if (!isHostValid || !isPortValid || !isIdValid || !isPasswordValid) return false;
		return true;
	};

	// Client 연결
	const connectToOpenSearch = async () => {
		const isClientInfoValid = validateClientInfo(clientInfo);
		if (!isClientInfoValid) {
			toast.warning($i18n.t('Invalid client information'), {
				position: 'top-right',
				autoClose: 7000
			});
			return;
		}

		try {
			const response = await fetch('API 연결', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(clientInfo)
			});

			if (!response.ok) {
				toast.warning($i18n.t('Internal Server Error'), {
					position: 'top-right',
					autoClose: 7000
				});
				return;
			}

			const data = await response.json();
			/**
			 * 1. 클라이언트 연결이 성공적이면 성공 response를 통해 clientInfo.isValid 값 true로 변경 / 아니면 false / false면 에러문구 표시
			 * 2. clientInfo.isValid 요청이 true가 되면 OpenSearch Query, OpenSearch Index 기능 보이게 지정
			 */
		} catch (error) {
			toast.warning($i18n.t(error.message), {
				position: 'top-right',
				autoClose: 7000
			});
		}
	};

	// 검색 키워드에 따른 index List 필터링
	$: indexInfo.filteredIndices = indexInfo.originalIndices.filter((index) =>
		index.toLowerCase().includes(indexInfo.searchIndexValue.toLowerCase())
	);

	// 인덱스 Dropdown List에서 선택 시 표기 인덱스 변경
	const selectOption = (option) => {
		indexInfo.selectedIndex = option;
		indexInfo.isIndexSelected = true;
		indexInfo.isOpen = false;
	};

	// 바깥 클릭 시 Dropdown List 닫힘
	const handleClickOutside = (event) => {
		if (!event.target.closest('.dropdown')) indexInfo.isOpen = false;
	};

	const handleClientSubmit = (e) => {
		e.preventDefault();
	};

	const handleQuerySubmit = async (e) => {
		e.preventDefault();

		if (!indexInfo.isIndexSelected) {
			toast.warning($i18n.t('Please select an index'), {
				position: 'top-right',
				autoClose: 7000
			});
			return;
		}

		try {
			const queryJson = JSON.parse(queryInfo.query);

			const response = await fetch('API 연결', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(parsed)
			});

			if (!response.ok) {
				toast.warning($i18n.t('Internal Server Error'), {
					position: 'top-right',
					autoClose: 7000
				});
				return;
			}

			const data = await response.json();
		} catch (error) {
			toast.warning($i18n.t(`Query Failed: ${error.message}`), {
				position: 'top-right',
				autoClose: 7000
			});
		}
	};

	onMount(() => {
		// Query Editor
		const view = new EditorView({
			doc: queryInfo.query,
			extensions: [
				basicSetup,
				json(),
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						queryInfo.query = update.state.doc.toString();
					}
				})
			],
			parent: editorContainer
		});

		/**
		 * 추후에 API 통신으로 OpenSearch로부터 인덱스 리스트 불러오는 로직 작성 필요
		 */

		window.addEventListener('click', handleClickOutside);
		return () => window.removeEventListener('click', handleClickOutside);
	});

	/**
	 * ############ 추가 끝 ############
	 */
</script>

<div class=" dark:text-white">
	<div class=" flex items-center justify-between dark:text-gray-100 mb-2">
		<div class=" text-lg font-medium self-center font-primary">{$i18n.t('Chat Controls')}</div>
		<button
			class="self-center"
			on:click={() => {
				dispatch('close');
			}}
		>
			<XMark className="size-3.5" />
		</button>
	</div>

	<div class=" dark:text-gray-200 text-sm font-primary py-0.5 px-0.5">
		{#if $user?.role === 'admin'}
			<form on:submit={handleClientSubmit}>
				<Collapsible title="OpenSearch Client" open={true} buttonClassName="w-full">
					<div class="grid grid-cols-2 gap-2 mt-1.5" slot="content">
						<div>
							<label for="">Host</label>
							<input
								type="text"
								class="w-full p-[7px] flex rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition my-1 items-center justify-center border border-gray-300"
								placeholder="Host"
								bind:value={clientInfo.host}
							/>
						</div>
						<div>
							<label for="">Port</label>
							<input
								type="text"
								class="w-full p-[7px] flex rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition my-1 items-center justify-center border border-gray-300"
								placeholder="Port"
								bind:value={clientInfo.port}
							/>
						</div>
						<div>
							<label for="">Id</label>
							<input
								type="text"
								class="w-full p-[7px] flex rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition my-1 items-center justify-center border border-gray-300"
								placeholder="Id"
								autocomplete="off"
								bind:value={clientInfo.id}
							/>
						</div>
						<div>
							<label for="">Password</label>
							<input
								type="password"
								class="w-full p-[7px] flex rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition my-1 items-center justify-center border border-gray-300"
								placeholder="Password"
								autocomplete="off"
								bind:value={clientInfo.password}
							/>
						</div>

						<button
							type="button"
							class="cursor-pointer col-span-2 p-[7px] flex rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition my-1 items-center justify-center border border-gray-300"
							on:click={connectToOpenSearch}>연결</button
						>
					</div>
				</Collapsible>
				<hr class="my-2 border-gray-50 dark:border-gray-700/10" />
			</form>

			<form on:submit={handleQuerySubmit}>
				<Collapsible title="OpenSearch Index" open={true} buttonClassName="w-full">
					<div class="flex flex-col gap-1 mt-1.5" slot="content">
						<div class="relative inline-block dropdown text-center">
							<button
								class="cursor-pointer p-[7px] w-full rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition my-1 items-center justify-center border border-gray-300"
								type="button"
								on:click={() => (indexInfo.isOpen = !indexInfo.isOpen)}
							>
								{indexInfo.selectedIndex}
							</button>

							{#if indexInfo.isOpen}
								<div
									class="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow z-10 max-h-[200px] overflow-y-auto"
								>
									<div class="flex items-center gap-2.5 px-4 py-2">
										<Search className="size-4" strokeWidth="2.5" />
										<input
											id="index-search-input"
											bind:value={indexInfo.searchIndexValue}
											class="w-full text-sm bg-transparent outline-hidden"
											placeholder="인덱스 검색"
											autocomplete="off"
										/>
									</div>
									{#if indexInfo.filteredIndices.length > 0}
										{#each indexInfo.filteredIndices as index}
											<button
												on:click={() => selectOption(index)}
												class="block w-full px-4 py-2 text-gray-700 text-center hover:bg-gray-100"
											>
												{index}
											</button>
										{/each}
									{:else}
										<div class="w-full px-4 py-2 text-gray-700 text-center">검색 결과 없음</div>
									{/if}
								</div>
							{/if}
						</div>
					</div>
				</Collapsible>
				<hr class="my-2 border-gray-50 dark:border-gray-700/10" />

				<Collapsible title="OpenSearch Query" open={true} buttonClassName="w-full">
					<div class="flex flex-col gap-1 mt-1.5" slot="content">
						<div bind:this={editorContainer} class="border rounded p-2 min-h-[150px]" />

						<button
							type="submit"
							class="cursor-pointer p-[7px] flex rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition my-1 items-center justify-center border border-gray-300"
							>검색</button
						>
					</div>
				</Collapsible>
				<hr class="my-2 border-gray-50 dark:border-gray-700/10" />
			</form>
		{/if}

		{#if chatFiles.length > 0}
			<Collapsible title={$i18n.t('Files')} open={true} buttonClassName="w-full">
				<div class="flex flex-col gap-1 mt-1.5" slot="content">
					{#each chatFiles as file, fileIdx}
						<FileItem
							className="w-full"
							item={file}
							edit={true}
							url={file?.url ? file.url : null}
							name={file.name}
							type={file.type}
							size={file?.size}
							dismissible={true}
							on:dismiss={() => {
								// Remove the file from the chatFiles array

								chatFiles.splice(fileIdx, 1);
								chatFiles = chatFiles;
							}}
							on:click={() => {
								console.log(file);
							}}
						/>
					{/each}
				</div>
			</Collapsible>

			<hr class="my-2 border-gray-50 dark:border-gray-700/10" />
		{/if}

		<Collapsible bind:open={showValves} title={$i18n.t('Valves')} buttonClassName="w-full">
			<div class="text-sm" slot="content">
				<Valves show={showValves} />
			</div>
		</Collapsible>

		{#if $user?.role === 'admin' || $user?.permissions.chat?.controls}
			<hr class="my-2 border-gray-50 dark:border-gray-700/10" />

			<Collapsible title={$i18n.t('System Prompt')} open={true} buttonClassName="w-full">
				<div class="" slot="content">
					<textarea
						bind:value={params.system}
						class="w-full text-xs py-1.5 bg-transparent outline-hidden resize-none"
						rows="4"
						placeholder={$i18n.t('Enter system prompt')}
					/>
				</div>
			</Collapsible>

			<hr class="my-2 border-gray-50 dark:border-gray-700/10" />

			<Collapsible title={$i18n.t('Advanced Params')} open={true} buttonClassName="w-full">
				<div class="text-sm mt-1.5" slot="content">
					<div>
						<AdvancedParams admin={$user?.role === 'admin'} bind:params />
					</div>
				</div>
			</Collapsible>
		{/if}
	</div>
</div>
