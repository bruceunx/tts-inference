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


