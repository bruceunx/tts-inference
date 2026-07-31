.PHONY: run

run:
	time ./bin/crispasr -m ./model/cosyvoice3-llm-q4_k.gguf \
         --backend cosyvoice3-tts \
         --voice ./input/johnlee.wav \
		     --i-have-rights \
         --ref-text "cat then figured. The sailor agreed, following Bathardish down and dogging the hatch behind him. You never know when the barbarians are going to go nuts. I don't know how you fellas can take it. He assured, shaking his head. They had some bad ones you get to know them. Bathardish suggested, and the food is good if spicy, but it was time for us to go, for now. Where does the captain?" \
         --tts "The sailor agreed, following Bathardish down and dogging the hatch behind him. You never know when the barbarians are going to go nuts." \
         --tts-output ./output/out.wav

chat:
	time ./bin/crispasr -m ./model/chatterbox-turbo \
		     --backend chatterbox-turbo \
         --voice ./input/johnlee.wav \
		     --i-have-rights \
         --ref-text "cat then figured. The sailor agreed, following Bathardish down and dogging the hatch behind him. You never know when the barbarians are going to go nuts. I don't know how you fellas can take it. He assured, shaking his head. They had some bad ones you get to know them. Bathardish suggested, and the food is good if spicy, but it was time for us to go, for now. Where does the captain?" \
         --tts "The sailor agreed, following Bathardish down and dogging the hatch behind him. You never know when the barbarians are going to go nuts." \
         --tts-output ./output/out.wav


help:
	./bin/crispasr --help

conv:
	ffmpeg -i ./input/input.mp4 -ar 16000 -ac 1 -c:a pcm_s16le ./input/johnlee.wav
