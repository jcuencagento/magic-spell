import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit =
	process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
		? new Ratelimit({
				redis: new Redis({
					url: process.env.KV_REST_API_URL,
					token: process.env.KV_REST_API_TOKEN,
				}),
				limiter: Ratelimit.slidingWindow(10, "5 m"),
				analytics: true,
		  })
		: false;

const groq = new OpenAI({
	apiKey: process.env.GROQ_API_KEY!,
	baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
	if (ratelimit) {
		const ip = req.headers.get("x-real-ip") ?? "local";
		const rl = await ratelimit.limit(ip);

		if (!rl.success) {
			return new Response("Rate limit exceeded", { status: 429 });
		}
	}

	const { text, prompt } = await req.json();
	if (!prompt) return new Response("Prompt is required", { status: 400 });

	const response = await groq.chat.completions.create({
		model: "mixtral-8x7b-32768",
		stream: true,
		messages: [
			{
				role: "system",
				content: `You are a Spanish text editor. You will need to search and act as a medical expert. If you assess that the conversation is not medical related, say it and stop. You will be given a prompt and a text to edit, which may be empty or incomplete. Edit the text to match the prompt, and only respond with the full edited version of the text - do not include any other information, context, or explanation. Do not include the prompt or otherwise preface your response. Do not enclose the response in quotes. Take into account this will be asked by ill people. Questions and answers will and MUST be in Spanish.`,
			},
			{
				role: "user",
				content: `Prompt: ${prompt}\nText: ${text}`,
			},
		],
	});

	const stream = OpenAIStream(response);
	return new StreamingTextResponse(stream);
}
