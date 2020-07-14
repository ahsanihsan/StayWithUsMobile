import React from "react";
import { View, Text, ScrollView } from "react-native";
import Header from "../../ReuseableComponents/Header";

export default function TermsAndServices(props) {
	return (
		<View>
			<Header title="Terms Of Services" isBack navigation={props.navigation} />
			<ScrollView
				style={{ width: "80%", alignSelf: "center" }}
				showsVerticalScrollIndicator={false}
			>
				<Text style={{ flex: 1, marginBottom: "10%", marginTop: "5%" }}>
					<Text style={{ fontWeight: "bold" }}>
						Generic Terms of Service Template
					</Text>
					{"\n"}
					{"\n"}
					Please read these terms of service terms of service carefully before
					using Stay With Us operated by Real Estate Company.
					{"\n"}
					{"\n"}
					<Text style={{ fontWeight: "bold" }}>Conditions of Use</Text>
					{"\n"}
					{"\n"}
					We will provide their services to you, which are subject to the
					conditions stated below in this document. Every time you visit this
					website, use its services or make a purchase, you accept the following
					conditions. This is why we urge you to read them carefully.
					{"\n"}
					{"\n"}
					<Text style={{ fontWeight: "bold" }}>Privacy Policy</Text>
					{"\n"}
					{"\n"}
					Before you continue using our website we advise you to read our
					privacy policy [link to privacy policy] regarding our user data
					collection. It will help you better understand our practices.
					{"\n"}
					{"\n"}
					<Text style={{ fontWeight: "bold" }}>Copyright</Text>
					{"\n"}
					{"\n"}
					Content published on this website (digital downloads, images, texts,
					graphics, logos) is the property of [name] and/or its content creators
					and protected by international copyright laws. The entire compilation
					of the content found on this website is the exclusive property of
					[name], with copyright authorship for this compilation by [name].
					{"\n"}
					{"\n"}
					<Text style={{ fontWeight: "bold" }}>Communications</Text>
					{"\n"}
					{"\n"}
					The entire communication with us is electronic. Every time you send us
					an email or visit our website, you are going to be communicating with
					us. You hereby consent to receive communications from us. If you
					subscribe to the news on our website, you are going to receive regular
					emails from us. We will continue to communicate with you by posting
					news and notices on our website and by sending you emails. You also
					agree that all notices, disclosures, agreements and other
					communications we provide to you electronically meet the legal
					requirements that such communications be in writing.
					{"\n"}
					{"\n"}
					<Text style={{ fontWeight: "bold" }}>Applicable Law</Text>
					{"\n"}
					{"\n"}
					By visiting this website, you agree that the laws of the [your
					location], without regard to principles of conflict laws, will govern
					these terms of service, or any dispute of any sort that might come
					between [name] and you, or its business partners and associates.
					{"\n"}
					{"\n"}
					<Text style={{ fontWeight: "bold" }}>Disputes</Text>
					{"\n"}
					{"\n"}
					Any dispute related in any way to your visit to this website or to
					products you purchase from us shall be arbitrated by state or federal
					court [your location] and you consent to exclusive jurisdiction and
					venue of such courts.
					{"\n"}
					{"\n"}
					<Text style={{ fontWeight: "bold" }}>
						Comments, Reviews, and Emails
					</Text>
					{"\n"}
					{"\n"}
					Visitors may post content as long as it is not obscene, illegal,
					defamatory, threatening, infringing of intellectual property rights,
					invasive of privacy or injurious in any other way to third parties.
					Content has to be free of software viruses, political campaign, and
					commercial solicitation.
					{"\n"}
				</Text>
			</ScrollView>
		</View>
	);
}
