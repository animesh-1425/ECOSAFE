import { useState } from "react";
import { Link } from "react-router-dom";
import XSvg from "../../../components/svgs/X";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const queryClient = useQueryClient();

	const {
		mutate: loginMutation,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ username, password }) => {
			try {
				const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ username, password }),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="max-w-screen-xl mx-auto flex h-screen">
			{/* Logo Section */}
			<div className="flex-1 hidden lg:flex items-center justify-center">
				<XSvg className="lg:w-2/3 fill-white translate-x-6 -translate-y-8" />
			</div>

			{/* Login Form Section */}
			<div className="flex-1 flex flex-col justify-center items-center">
				<form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
					{/* Mobile Logo */}
					<XSvg className="w-24 lg:hidden fill-white mb-2" />
					<h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>

					<label className="input input-bordered rounded flex items-center gap-2">
						<MdOutlineMail />
						<input
							type="text"
							className="grow"
							placeholder="username"
							name="username"
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label className="input input-bordered rounded flex items-center gap-2">
						<MdPassword />
						<input
							type="password"
							className="grow"
							placeholder="Password"
							name="password"
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>

					<button className="btn rounded-full text-black" style={{ backgroundColor: "rgb(76, 255, 60)", borderColor: "rgb(76, 255, 60)" }}>
						{isPending ? "Loading..." : "Login"}
					</button>
					{isError && <p className="text-red-500">{error.message}</p>}
				</form>

				{/* Sign-up Section */}
				<div className="flex flex-col gap-2 mt-4">
					<p className="text-white text-lg">{"Don't"} have an account?</p>
					<Link to="/signup">
					<button
  					className="btn rounded-full text-black w-full"style={{ backgroundColor: "rgb(76, 255, 60)", borderColor: "rgb(76, 255, 60)" }}>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
