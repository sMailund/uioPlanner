# -*- coding: utf-8 -*-

#I give up
def norwegify(str):
    return str.encode("utf-8") \
        .replace("\u00E6", "æ") \
        .replace("\u00C6", "Æ") \
        .replace("\u00f8", "ø") \
        .replace("\u00D8", "Ø") \
        .replace("\u00E5", "å") \
        .replace("\u00C5", "Å")
