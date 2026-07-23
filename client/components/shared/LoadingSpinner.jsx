"use client";

export default function LoadingSpinner() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-blue-600 animate-spin"></div>
		</div>
	);
}
