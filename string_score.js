/*!
 * string_score.js: Quicksilver-like string scoring algorithm.
 * Special thanks to Lachie Cox and Quicksilver for inspiration.
 *
 * Copyright (C) 2009 Joshaven Potter <yourtech@gmail.com>
 * Copyright (C) 2010 Gora Khargosh <gora.khargosh@gmail.com>
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

/*
function __first_valid_index(a, b) {
    var min = Math.min(a, b);
    if (min > -1) {
        return min;
    }
    return Math.max(a, b);
}
*/

/**
 * Scores a string against another string.
 *
 * @param abbreviation
 */
String.prototype.score = function(abbreviation) {
    // If the string is equal to the abbreviation, perfect match.
    if (this == abbreviation) {
        return 1.0;
    }

    var total_character_score = 0,
        abbreviation_length = abbreviation.length,
        string = this,
        string_length = string.length,
        start_of_string_bonus = false,
        abbreviation_score = 0,
        percentage_of_matched_string = 0,
        word_score = 0,
        final_score = 0;

    // Walk through abbreviation and add up scores.
    for (var i = 0,
             character_score = 0,
             index_in_string = 0,
             c = '',
             index_c_lowercase = 0,
             index_c_uppercase = 0,
             min_index = 0;
         i < abbreviation_length;
         ++i) {

        // Find the first case-insensitive match of a character.
        c = abbreviation.charAt(i);

        //index_in_string = __first_valid_index(
        //    string.indexOf(c.toLowerCase()),
        //    string.indexOf(c.toUpperCase())
        //);
        // Inlined the above call below.
        index_c_lowercase = string.indexOf(c.toLowerCase());
        index_c_uppercase = string.indexOf(c.toUpperCase());
        min_index = Math.min(index_c_lowercase, index_c_uppercase);
        index_in_string = (min_index > -1) ?
            min_index :
            Math.max(index_c_lowercase, index_c_uppercase);
        // End inlining.

        if (index_in_string === -1) {
            // Bail out if no abbr[i] is not found in string
            return 0;
        }

        // Set base score for matching 'c'.
        character_score = 0.1;

        // Same case bonus.
        if (string.charAt(index_in_string) === c) {
            character_score += 0.1;
        }

        // Consecutive letter & start-of-string Bonus
        if (index_in_string === 0) {
            // Increase the score when matching first character of the
            // remainder of the string
            character_score += 0.8;
            if (i === 0) {
                // If match is the first character of the string
                // & the first character of abbreviation, add a
                // start-of-string match bonus.
                start_of_string_bonus = true;
            }
        }

        // Acronym Bonus
        // Weighing Logic: Typing the first character of an acronym is as if you
        // preceded it with two perfect character matches.
        if (string.charAt(index_in_string - 1) === ' ') {
            character_score += 0.8; // * Math.min(index_in_string, 5); // Cap bonus at 0.4 * 5
        }

        // Left trim the already matched part of the string
        // (forces sequential matching).
        string = string.substring(index_in_string + 1, string_length);

        total_character_score += character_score;
    }

    // Uncomment to weigh smaller words higher.
    // return total_character_score / string_length;

    abbreviation_score = total_character_score / abbreviation_length;
    percentage_of_matched_string = abbreviation_length / string_length;
    word_score = abbreviation_score * percentage_of_matched_string;

    // Reduce penalty for longer strings.
    final_score = (word_score + abbreviation_score) / 2;

    if (start_of_string_bonus && (final_score + 0.1 < 1)) {
        final_score += 0.1;
    }

    return final_score;
};
