.PHONY: run

run:
	./bin/crispasr -m ./model/cosyvoice3-llm-q4_k.gguf \
         --backend cosyvoice3-tts \
         --voice ./input/johnlee.wav \
		     --i-have-rights \
         --ref-text "exact transcription of my_reference.wav" \
         --tts "The text to speak in the cloned voice." \
         --tts-output ./output/out.wav

help:
	./bin/crispasr --help

conv:
	ffmpeg -i ./input/input.mp4 -ar 16000 -ac 1 -c:a pcm_s16le ./input/johnlee.wav


