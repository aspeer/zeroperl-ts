#!/usr/bin/env perl
use strict;
use warnings;

my ($input_pn, $output_pn)=@ARGV;
die("Usage: report.pl INPUT OUTPUT\n") unless defined($input_pn)&&defined($output_pn);
open(my $input_fh, '<', $input_pn) || die("open $input_pn: $!");
my %count;
while (my $line=<$input_fh>) {
    foreach my $word (lc($line)=~/([a-z]+)/g) {
        $count{$word}++;
    }
}
close($input_fh) || die("close $input_pn: $!");
open(my $output_fh, '>', $output_pn) || die("open $output_pn: $!");
foreach my $word (sort(keys(%count))) {
    print {$output_fh} "$word: $count{$word}\n";
}
close($output_fh) || die("close $output_pn: $!");
