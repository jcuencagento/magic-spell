"use client";

import { LoaderIcon, SparklesIcon, CleanTextFieldIcon } from "@/app/icons";
import { useCompletion } from "ai/react";
import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";

export default function Home() {
	const [text, setText] = useState("");

	const {
		completion,
		input,
		isLoading,
		handleInputChange,
		handleSubmit,
		setInput,
	} = useCompletion({
		body: { text },
		onFinish: (prompt, completion) => setText(completion.trim()),
		onError: (error) => toast.error(error.message),
	});

	function clearText() {
		setText("");
	}

	// warm up the completion endpoint
	useEffect(() => {
		fetch("/api/completion").catch(() => {});
	}, []);

	return (
		<form
			className="flex flex-col items-center md:justify-center text-base lg:text-lg w-full lg:w-1/2 py-10 grow"
			onSubmit={(e) => {
				handleSubmit(e);
				setInput("");
			}}
		>
			<div className="flex w-full mb-1 lg:-mb-2 justify-center">
				<button
					aria-label="clear"
					onClick={(e) => {
						e.preventDefault();
						clearText();
					}}
					className="rounded-full m-0 p-2 z-10 bg-red-600 hover:bg-red-800 active:bg-red-700 transition-colors text-white size-8 md:size-10 flex items-center justify-center"
				>
					{isLoading ? <LoaderIcon /> : <CleanTextFieldIcon />}
				</button>
			</div>

			<TextareaAutosize
				value={
					isLoading && completion.length > 0
						? completion.trim()
						: text
				}
				onChange={(e) => {
					if (!isLoading) setText(e.target.value);
				}}
				className="rounded-lg drop-shadow-sm bg-gray-100 border border-gray-200 px-2 pt-2 pb-6 md:resize dark:bg-gray-900 dark:border-gray-800 min-w-full max-w-7xl min-h-32 max-h-screen focus:outline-none focus:border-orange-600 dark:focus:border-yellow-200 transition-colors"
				placeholder="¿Cómo te encuentras hoy?"
				aria-label="Text"
				cacheMeasurements
			/>


			<div className="rounded-full drop-shadow-sm bg-gray-100 border border-gray-200 -mt-4 dark:bg-gray-900 dark:border-gray-800 flex lg:justify-between lg:w-2/3 focus-within:border-orange-600 dark:focus-within:border-yellow-200 transition-colors">
				<input
					className="bg-transparent rounded-full py-1 px-2 w-full lg:px-8 focus:outline-none"
					placeholder="Cuéntame más..."
					onChange={handleInputChange}
					value={input}
					aria-label="Prompt"
					required
				/>
				<button
					aria-label="Submit"
					type="submit"
					className="rounded-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-colors text-white size-8 md:size-12 flex items-center justify-center"
				>
					{isLoading ? <LoaderIcon /> : <SparklesIcon />}
				</button>
			</div>
		</form>
	);
}
